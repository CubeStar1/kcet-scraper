import { Button } from "@/components/ui/button";
import { User, Message, Channel } from "@/types/types";
import {Users} from "lucide-react"

interface ChatHeaderProps {
    currentChannel: Channel | null;
    isMobile: boolean;
    toggleUsers: () => void;
  }
  
  function ChatHeader({ currentChannel, isMobile, toggleUsers }: ChatHeaderProps) {
    return (
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
    );
  }

  export default ChatHeader
  