"use client"

import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { User, Message, Channel } from "@/types/types";


interface MessageInputProps {
    sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    currentChannel: Channel | null;
  }
  
  function MessageInput({ sendMessage, currentChannel }: MessageInputProps) {
    const [newMessage, setNewMessage] = useState("");
  
    return (
      <form onSubmit={(e) => { sendMessage(e); setNewMessage(""); }} className="p-4 border-t flex items-center space-x-2">
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
    );
  }
  export default MessageInput 

