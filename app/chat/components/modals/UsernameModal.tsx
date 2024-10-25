import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUserUsername: (username: string) => void;
}

export default function UsernameModal({ isOpen, onClose, setUserUsername }: UsernameModalProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (username.trim()) {
      setUserUsername(username);
      setUsername("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
        <DialogHeader>
          <DialogTitle>Set Your Username</DialogTitle>
        </DialogHeader>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">Set Username</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
