import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import ThreadsForm from '~/components/write/threads-form';

interface ThreadsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ThreadsDialog({
  open,
  onClose,
  onSuccess,
}: ThreadsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>새로운 스레드</DialogTitle>
        </DialogHeader>
        <ThreadsForm isDialog onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
