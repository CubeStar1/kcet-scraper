// components/modals/UsernameModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  setUsername: (name: string) => void;
  setUserUsername: () => void;
}

export default function UsernameModal({
  isOpen,
  onClose,
  username,
  setUsername,
  setUserUsername,
}: UsernameModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
        <DialogHeader>
          <DialogTitle>Set Your Username</DialogTitle>
        </DialogHeader>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
        <DialogFooter>
          <Button onClick={setUserUsername} className="w-full">Set Username</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
