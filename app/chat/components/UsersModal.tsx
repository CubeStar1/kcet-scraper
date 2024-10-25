// components/modals/UsersModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { User } from "@/types/types";

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export default function UsersModal({ isOpen, onClose, users }: UsersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
}
