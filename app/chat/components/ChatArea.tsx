// ChatArea.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Channel, Message, User } from "@/types/types";
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  currentChannel: Channel | null;
  messages: Message[];
  users: User[];
  user: User | null;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  deleteMessage: (messageId: string) => void;
  isMobile: boolean;
  toggleUsers: () => void;
}

export default function ChatArea({
  currentChannel,
  messages,
  users,
  user,
  sendMessage,
  deleteMessage,
  isMobile,
  toggleUsers,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        currentChannel={currentChannel}
        isMobile={isMobile}
        toggleUsers={toggleUsers}
      />
      <MessageList
        messages={messages}
        users={users}
        user={user}
        deleteMessage={deleteMessage}
      />
      <MessageInput
        sendMessage={sendMessage}
        currentChannel={currentChannel}
      />
    </div>
  );
}