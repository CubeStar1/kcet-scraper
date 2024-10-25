import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Message, Channel } from "@/types/types";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";

interface MessageListProps {
    messages: Message[];
    users: User[];
    user: User | null;
    deleteMessage: (messageId: string) => void;
  }
  
  function MessageList({ messages, users, user, deleteMessage }: MessageListProps) {
    return (
      <ScrollArea className="flex-1 px-4 min-h-[60vh] max-h-[calc(100vh-20rem)] overflow-y-auto sm:max-h-[calc(100vh-15rem)] sm:min-h-[68vh] md:max-h-[calc(100vh-18rem)] lg:max-h-[calc(100vh-1rem)]">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            users={users}
            user={user}
            deleteMessage={deleteMessage}
          />
        ))}
      </ScrollArea>
    );
  }

  export default MessageList