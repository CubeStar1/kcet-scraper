import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { User, Message, Channel } from "@/types/types";

interface UsersListProps {
  users: User[];
}

function UsersList({ users }: UsersListProps) {
  return (
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
  );
}
export default UsersList