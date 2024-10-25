"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Message, Channel } from "@/types/types";
import { format } from "date-fns";
import { Send, Hash, Plus, Users, Edit, Trash2, Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [isRenameChannelModalOpen, setIsRenameChannelModalOpen] = useState(false);
  const [renameChannelName, setRenameChannelName] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const { data: user } = useUser();
  const supabase = createSupabaseBrowser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (user) {
      checkUsername();
    }
    fetchChannels();
    fetchUsers();

    return () => {
      supabase.removeAllChannels();
    };
  }, [user]);

  useEffect(() => {
    if (currentChannel) {
      fetchMessages(currentChannel.id);
      subscribeToChannel(currentChannel.id);
    }
  }, [currentChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkUsername = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("usernames")
      .select("username")
      .eq("user_id", user.id)
      .single();
    
    if (error || !data) {
      setIsUsernameModalOpen(true);
    } else {
      setUsername(data.username);
    }
  };

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .order("name", { ascending: true });
    if (data) {
      setChannels(data);
      if (data.length > 0 && !currentChannel) {
        setCurrentChannel(data[0]);
      }
    }
  };

  const fetchMessages = async (channelId: number) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("username", { ascending: true });
    if (data) {
      setUsers(data);
    }
  };
  

  const subscribeToChannel = (channelId: number) => {
    const channel = supabase
      .channel(`public:messages:channel_id=eq.${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !currentChannel) return;

    const { error } = await supabase
      .from("messages")
      .insert({ content: newMessage, user_id: user.id, channel_id: currentChannel.id });

    if (!error) setNewMessage("");
  };

  const setUserUsername = async () => {
    if (!username.trim() || !user) return;

    const { error } = await supabase
      .from("usernames")
      .upsert({ user_id: user.id, username }, { onConflict: "user_id" });

    if (!error) {
      setIsUsernameModalOpen(false);
      fetchUsers();
    }
  };

  const createNewChannel = async () => {
    if (!newChannelName.trim()) return;

    const { data, error } = await supabase
      .from("channels")
      .insert({ name: newChannelName })
      .select()
      .single();

    if (data) {
      setChannels([...channels, data]);
      setCurrentChannel(data);
      setIsNewChannelModalOpen(false);
      setNewChannelName("");
    }
  };

  const renameChannel = async () => {
    if (!renameChannelName.trim() || !currentChannel) return;

    const { data, error } = await supabase
      .from("channels")
      .update({ name: renameChannelName })
      .eq("id", currentChannel.id)
      .select()
      .single();

    if (data) {
      setChannels(channels.map(ch => ch.id === data.id ? data : ch));
      setCurrentChannel(data);
      setIsRenameChannelModalOpen(false);
      setRenameChannelName("");
    }
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (!error) {
      setMessages(messages.filter(m => m.id !== messageId));
      
    }
  };

  // const handleDeleteMessage = async (messageId: string) => {
  //   useEffect(() => {
  //     deleteMessage(messageId);
  //   }, [messageId, messages]);
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUsers = () => {
    if (isMobile) {
      setIsUsersModalOpen(true);
    } else {
      setShowUsers(!showUsers);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
  const { data, error } = await supabase
    .from('users')
    .update({ user_role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
  } else {
    // Update the local users state
    setUsers(users.map(u => u.id === userId ? { ...u, user_role: newRole } : u));
  }
};

  return (
    <div className="flex flex-col max-h-[calc(100vh-100px)] md:flex-row  bg-background">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 flex justify-between items-center bg-secondary">
        <h2 className="text-2xl font-bold">Chat</h2>
        <Button onClick={toggleMobileMenu} variant="ghost">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar (Channels and Users) */}
      <div className={`${isMobile && !isMobileMenuOpen ? 'hidden' : 'flex'} flex-col border-r md:flex md:w-64  p-4`}>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Channels</h2>
          <Button onClick={() => setIsNewChannelModalOpen(true)} className="w-full mb-4">
            <Plus className="w-4 h-4 mr-2" /> New Channel
          </Button>
          <ScrollArea className= "md:h-auto">
            <div className="space-y-2">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    currentChannel?.id === channel.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setCurrentChannel(channel);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>{channel.name}</span>
                  </div>
                  {currentChannel?.id === channel.id && (
                    <Button size="sm" variant="ghost" onClick={() => setIsRenameChannelModalOpen(true)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Button onClick={toggleUsers} className=" hidden md:flex justify-center items-center ">
          <Users className="w-4 h-4 mr-2 justify-center items-center"  /> {showUsers ? "Hide Users" : "Show Users"}
        </Button>
      </div>

      {/* Users Sidebar (conditionally rendered) */}
      {showUsers && !isMobile && (
        <div className="w-64 border-r p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <ScrollArea className="flex-grow">
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center space-x-2 p-2">
                  <Avatar className="w-8 h-8 border-2 border-secondary-foreground justify-center items-center p-4 m-2">
                    {u.username?.slice(0, 1)}
                  </Avatar>
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {currentChannel ? `# ${currentChannel.name}` : "Select a channel"}
          </h3>
          {isMobile && (
            <Button onClick={toggleUsers} variant="ghost">
              <Users className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 min-h-[60vh] max-h-[calc(100vh-20rem)] overflow-y-auto sm:max-h-[calc(100vh-15rem)] sm:min-h-[68vh] md:max-h-[calc(100vh-18rem)] lg:max-h-[calc(100vh-1rem)]">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 }}
              className={`flex mb-4 ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[70%] ${message.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 border-2 border-secondary-foreground justify-center items-center p-4 m-2">
                  {users.find(u => u.id === message.user_id)?.username?.slice(0, 1)}
                </Avatar>
                <div className={`rounded-lg px-4 py-2 ${
                  message.user_id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{users.find(u => u.id === message.user_id)?.username || message.user_id}</p>
                    {users.find(u => u.id === message.user_id)?.user_role === 'moderator' && (
                      <Button size="sm" variant="ghost" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          <div style={{ marginBottom: 10 }} ref={messagesEndRef} />
        </ScrollArea>

        {/* Message input */}
        <form onSubmit={sendMessage} className="p-4 border-t flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={currentChannel ? `Message #${currentChannel.name}` : "Select a channel"}
            className="flex-grow"
            disabled={!currentChannel}
          />
          <Button type="submit" size="icon" disabled={!currentChannel}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* New Channel Modal */}
      <Dialog open={isNewChannelModalOpen} onOpenChange={setIsNewChannelModalOpen}>
        <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
          </DialogHeader>
          <Input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Enter channel name"
          />
          <DialogFooter>
            <Button onClick={createNewChannel} className="w-full">Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Channel Modal */}
      <Dialog open={isRenameChannelModalOpen} onOpenChange={setIsRenameChannelModalOpen}>
        <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
          <DialogHeader>
            <DialogTitle>Rename Channel</DialogTitle>
          </DialogHeader>
          <Input
            value={renameChannelName}
            onChange={(e) => setRenameChannelName(e.target.value)}
            placeholder="Enter new channel name"
          />
          <DialogFooter>
            <Button onClick={renameChannel} className="w-full">Rename Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Username Modal */}
      <Dialog open={isUsernameModalOpen} onOpenChange={setIsUsernameModalOpen}>
        <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
          </DialogHeader>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            />
            <DialogFooter>
            <Button onClick={setUserUsername} className="w-full">Set Username</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        {/* Users Modal for Mobile */}
        <Dialog open={isUsersModalOpen} onOpenChange={setIsUsersModalOpen}>
        <DialogContent className="w-full max-w-md px-4 pt-4 sm:p-8 gap-8">
            <DialogHeader>
            <DialogTitle>Users</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[30vh]">
            <div className="space-y-2">
                {users.map((u) => (
                <div key={u.id} className="flex items-center space-x-2 p-2">
                    <Avatar className="w-8 h-8 border-2 border-secondary-foreground justify-center items-center p-4 m-2">
                    {u.username?.slice(0, 1)}
                    </Avatar>
                    <span>{u.username}</span>
                </div>
                ))}
            </div>
            </ScrollArea>
        </DialogContent>
        </Dialog>
    </div>
    );
    }
