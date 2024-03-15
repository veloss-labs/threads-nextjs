import React from 'react';
import ThreadFollowsList from '~/components/shared/thread-follows-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const initialData = await api.threads.getFollows({
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadFollowsList initialData={initialData} />
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
