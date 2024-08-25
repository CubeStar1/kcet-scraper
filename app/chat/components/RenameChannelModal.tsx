// components/modals/RenameChannelModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RenameChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  renameChannelName: string;
  setRenameChannelName: (name: string) => void;
  renameChannel: () => void;
}

export default function RenameChannelModal({
  isOpen,
  onClose,
  renameChannelName,
  setRenameChannelName,
  renameChannel,
}: RenameChannelModalProps) {
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
          <Button onClick={renameChannel} className="w-full">Rename Channel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
