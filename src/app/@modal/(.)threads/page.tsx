'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import ThreadsDialog from '~/components/write/threads-dialog';
import ThreadsSheet from '~/components/write/threads-sheet';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { useMediaQuery } from '~/libs/hooks/useMediaQuery';

export default function Modal() {
  const router = useRouter();
  const pathname = usePathname();

  const open = ['threads', '/threads'].includes(pathname);

  const onClose = useCallback(() => {
    router.replace(PAGE_ENDPOINTS.ROOT);
  }, [router]);

  const isMobile = useMediaQuery('(max-width: 768px)', false);

  if (isMobile) {
    return <ThreadsSheet open={open} onClose={onClose} />;
  }

  return <ThreadsDialog open={open} onClose={onClose} />;
}
