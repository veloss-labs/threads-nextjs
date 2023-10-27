'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import ThreadsForm from '~/components/write/threads-form';

export default function ThreadsDialog() {
  const router = useRouter();
  const pathname = usePathname();

  const open = ['threads', '/threads'].includes(pathname);

  const onClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>새로운 스레드</DialogTitle>
        </DialogHeader>
        <ThreadsForm isDialog />
      </DialogContent>
    </Dialog>
  );
}
