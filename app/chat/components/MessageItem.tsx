import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { User, Message, Channel } from "@/types/types";
import { format } from "date-fns";



interface MessageItemProps {
    message: Message;
    users: User[];
    user: User | null;
    deleteMessage: (messageId: string) => void;
  }
  
  function MessageItem({ message, users, user, deleteMessage }: MessageItemProps) {
    return (
      <motion.div
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
              {user?.user_role === 'moderator' && (
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
    );
  }

  export default MessageItem