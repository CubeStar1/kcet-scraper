import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RenameChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  renameChannel: (name: string) => void;
}

export default function RenameChannelModal({ isOpen, onClose, renameChannel }: RenameChannelModalProps) {
  const [renameChannelName, setRenameChannelName] = useState("");

  const handleSubmit = () => {
    if (renameChannelName.trim()) {
      renameChannel(renameChannelName);
      setRenameChannelName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
        <DialogHeader>
          <DialogTitle>Rename Channel</DialogTitle>
        </DialogHeader>
        <Input
          value={renameChannelName}
          onChange={(e) => setRenameChannelName(e.target.value)}
          placeholder="Enter new channel name"
        />
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">Rename Channel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
