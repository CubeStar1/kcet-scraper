// Sidebar.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Hash, Edit, Users, Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Channel, User } from "@/types/types";
import ChannelItem from "./ChannelItem";
import UsersList from "./UsersList";

interface SidebarProps {
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  setIsNewChannelModalOpen: (isOpen: boolean) => void;
  setIsRenameChannelModalOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  showUsers: boolean;
  setShowUsers: (show: boolean) => void;
  toggleUsers: () => void;
  users: User[];
}

export default function Sidebar({
  channels,
  currentChannel,
  setCurrentChannel,
  setIsNewChannelModalOpen,
  setIsRenameChannelModalOpen,
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  showUsers,
  setShowUsers,
  toggleUsers,
  users,
}: SidebarProps) {
  return (
    <>
      {isMobile && (
        <div className="md:hidden p-4 flex justify-between items-center bg-secondary">
          <h2 className="text-2xl font-bold">Chat</h2>
          <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      )}

      <div className={`${isMobile && !isMobileMenuOpen ? 'hidden' : 'flex'} flex-col border-r md:flex md:w-64 p-4`}>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Channels</h2>
          <Button onClick={() => setIsNewChannelModalOpen(true)} className="w-full mb-4">
            <Plus className="w-4 h-4 mr-2" /> New Channel
          </Button>
          <ScrollArea className="md:h-auto">
            <div className="space-y-2">
              {channels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={currentChannel?.id === channel.id}
                  onClick={() => {
                    setCurrentChannel(channel);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                  onRename={() => setIsRenameChannelModalOpen(true)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <Button onClick={toggleUsers} className="hidden md:flex justify-center items-center">
          <Users className="w-4 h-4 mr-2 justify-center items-center" /> {showUsers ? "Hide Users" : "Show Users"}
        </Button>

        {showUsers && !isMobile && <UsersList users={users} />}
      </div>
    </>
  );
}