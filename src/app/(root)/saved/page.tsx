import React from 'react';
import { api } from '~/services/trpc/server';
import ThreadBookmarkList from '~/components/shared/thread-bookmarks-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { SITE_CONFIG } from '~/constants/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `저장됨 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `저장됨 • ${SITE_CONFIG.title}`,
  },
};

export default async function Pages() {
  const initialData = await api.threads.getBookmarks({
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadBookmarkList initialData={initialData} />
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
