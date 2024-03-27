'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useTransition } from 'react';
import {
  useLayoutMetaDataSessionStore,
  useLayoutStore,
} from '~/services/store/useLayoutStore';
import ThreadsDialog from '~/components/write/threads-dialog';
import ThreadsSheet from '~/components/write/threads-sheet';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { useMediaQuery } from '~/libs/hooks/useMediaQuery';
import { prepopulatedRichText } from '~/components/editor/lexical-editor';
import { useBeforeUnload } from '~/libs/hooks/useBeforeUnload';

export default function Modal() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { popup, popupClose } = useLayoutStore();

  const open = popup.open && popup.type === 'THREAD';

  const onClose = useCallback(() => {
    const cloneMeta = { ...popup.meta };
    const nextUrl = cloneMeta.redirectUrl || PAGE_ENDPOINTS.ROOT;

    popupClose();
    startTransition(() => {
      router.replace(nextUrl);
    });
  }, [popup, popupClose, router]);

  const isMobile = useMediaQuery('(max-width: 768px)', false);

  const onSuccess = useCallback(() => {
    onClose();
  }, [onClose]);

  const Popup = isMobile ? ThreadsSheet : ThreadsDialog;

  useBeforeUnload(
    useCallback(() => {
      useLayoutMetaDataSessionStore.getState().setMetaData(popup.meta);
    }, [popup.meta]),
  );

  console.log('popup.meta', popup.meta);

  return (
    <Popup
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      quotation={popup.meta?.quotation}
      editorState={
        prepopulatedRichText(popup.meta?.intialValue?.username).handle
      }
    />
  );
}
