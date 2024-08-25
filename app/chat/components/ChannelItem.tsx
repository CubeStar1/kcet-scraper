import { Button } from "@/components/ui/button";
import { Hash, Edit } from "lucide-react";
import { User, Message, Channel } from "@/types/types";


// ChannelItem.tsx
interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  onRename: () => void;
}

function ChannelItem({ channel, isActive, onClick, onRename }: ChannelItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <Hash className="w-4 h-4" />
        <span>{channel.name}</span>
      </div>
      {isActive && (
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onRename(); }}>
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
export default ChannelItem