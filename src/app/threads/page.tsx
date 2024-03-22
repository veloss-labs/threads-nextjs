'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useTransition } from 'react';
import { prepopulatedRichText } from '~/components/editor/lexical-editor';
import ThreadsForm from '~/components/write/threads-form';
import ThreadsTitle from '~/components/write/threads-title';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import {
  useLayoutMetaDataSessionStore,
  useLayoutStore,
} from '~/services/store/useLayoutStore';

export default function Page() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { popupClose, popup, popupOpen } = useLayoutStore();
  const isHydrating = useIsHydrating('[data-hydrating-signal]');

  const onSuccess = useCallback(() => {
    const cloneMeta = { ...popup.meta };
    const nextUrl = cloneMeta.redirectUrl;

    popupClose();
    startTransition(() => {
      if (nextUrl) {
        router.replace(nextUrl);
      } else {
        router.back();
      }
    });
  }, [router, popupClose, popup]);

  useEffect(() => {
    if (!isHydrating) return;

    const metaData = useLayoutMetaDataSessionStore.getState().getMetaData();
    if (!metaData) {
      return;
    }

    popupOpen('THREAD', metaData);

    return () => {
      useLayoutMetaDataSessionStore.getState().clearMetaData();
    };
  }, [isHydrating]);

  return (
    <div
      className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10"
      data-hydrating-signal
    >
      <ThreadsTitle />
      <ThreadsForm
        onSuccess={onSuccess}
        editorState={
          prepopulatedRichText(popup.meta?.intialValue?.username).handle
        }
      />
    </div>
  );
}
