'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useTransition } from 'react';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import ThreadsDialog from '~/components/write/threads-dialog';
import ThreadsSheet from '~/components/write/threads-sheet';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { useMediaQuery } from '~/libs/hooks/useMediaQuery';

export default function Modal() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { popup, popupClose } = useLayoutStore();

  const open = popup.open && popup.type === 'THREAD';

  const onClose = useCallback(() => {
    popupClose();
    startTransition(() => {
      router.replace(PAGE_ENDPOINTS.ROOT);
    });
  }, [router, popupClose]);

  const isMobile = useMediaQuery('(max-width: 768px)', false);

  const onSuccess = useCallback(() => {
    onClose();
  }, [onClose]);

  const Popup = isMobile ? ThreadsSheet : ThreadsDialog;

  return <Popup open={open} onClose={onClose} onSuccess={onSuccess} />;
}
