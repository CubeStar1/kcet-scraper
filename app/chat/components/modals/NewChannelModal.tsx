// modals/NewChannelModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  createNewChannel: (name: string) => void;
}

export default function NewChannelModal({ isOpen, onClose, createNewChannel }: NewChannelModalProps) {
    const [newChannelName, setNewChannelName] = useState("");
  
    const handleSubmit = () => {
      if (newChannelName.trim()) {
        createNewChannel(newChannelName);
        setNewChannelName("");
        onClose();
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-md px-4 sm:p-8 gap-8">
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
          </DialogHeader>
          <Input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Enter channel name"
          />
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full">Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }