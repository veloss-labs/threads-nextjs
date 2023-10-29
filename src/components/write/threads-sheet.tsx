import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import ThreadsForm from './threads-form';

interface ThreadsSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function ThreadsSheet({ open, onClose }: ThreadsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader className="text-left">
          <SheetTitle>새로운 스레드</SheetTitle>
        </SheetHeader>
        <ThreadsForm isDialog />
      </SheetContent>
    </Sheet>
  );
}
