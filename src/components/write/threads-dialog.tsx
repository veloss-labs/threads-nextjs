import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import type { NavItem } from '~/constants/nav';
import { cn } from '~/utils/utils';
import ThreadsForm from '~/components/write/threads-form';

interface ThreadsDialogProps extends NavItem {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

export default function ThreadsDialog({
  open,
  onOpenChange,
  disabled,
  icon,
  isMobile,
}: ThreadsDialogProps) {
  const Icon = icon;
  const baseCSS = isMobile
    ? 'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm'
    : 'mx-[2px] my-1 flex items-center px-8 py-5 text-lg font-medium transition-colors hover:rounded-md hover:bg-foreground/5 sm:text-sm';
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className={cn(
          baseCSS,
          open ? 'text-foreground' : 'text-foreground/60',
          disabled && 'cursor-not-allowed opacity-80',
        )}
      >
        <Icon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>새로운 스레드</DialogTitle>
        </DialogHeader>
        <ThreadsForm />
      </DialogContent>
    </Dialog>
  );
}
