"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Message } from "@/types/types";
import { format } from "date-fns";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const { data: user } = useUser();
  const supabase = createSupabaseBrowser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      checkUsername();
    }
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    fetchMessages();
    fetchUsernames();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
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

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data);
    }
  };

  const fetchUsernames = async () => {
    const { data, error } = await supabase
      .from("usernames")
      .select("*");
    if (data) {
      const usernameMap = data.reduce((acc, curr) => {
        acc[curr.user_id] = curr.username;
        return acc;
      }, {} as Record<string, string>);
      setUsernames(usernameMap);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from("messages")
      .insert({ content: newMessage, user_id: user.id });

    if (!error) setNewMessage("");
  };

  const setUserUsername = async () => {
    if (!username.trim() || !user) return;

    const { error } = await supabase
      .from("usernames")
      .upsert({ user_id: user.id, username }, { onConflict: "user_id" });

    if (!error) {
      setIsUsernameModalOpen(false);
      fetchUsernames();
    }
  };

  return (
    <div className="flex h-[90vh] bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-secondary p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <Input placeholder="Search" className="mb-4" />
        <ScrollArea className="flex-grow">
          <div className="space-y-2">
            {/* You can map through users or channels here */}
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary" />
              <span>General</span>
            </div>
            {/* More channels... */}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold"># General</h3>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex mb-4 ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[70%] ${message.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 mr-2" />
                <div className={`rounded-lg px-4 py-2 ${
                  message.user_id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="font-semibold">{usernames[message.user_id] || message.user_id}</p>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollArea>

        {/* Message input */}
        <form onSubmit={sendMessage} className="p-4 border-t flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Username modal */}
      <Dialog open={isUsernameModalOpen} onOpenChange={setIsUsernameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
          </DialogHeader>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <DialogFooter>
            <Button onClick={setUserUsername}>Set Username</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}