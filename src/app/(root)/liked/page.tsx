import React from 'react';
import { api } from '~/services/trpc/server';
import ThreadLikeList from '~/components/shared/thread-likes-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '~/constants/constants';

export const metadata: Metadata = {
  title: `내 좋아요 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `저장됨 • ${SITE_CONFIG.title}`,
  },
};

export default async function Pages() {
  const initialData = await api.threads.getLikes({
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadLikeList initialData={initialData} />;
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
