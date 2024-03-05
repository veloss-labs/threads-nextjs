import React from 'react';
import { api } from '~/services/trpc/server';
import ThreadLikeList from '~/components/shared/thread-likes-list';
import SkeletonCardList from '~/components/skeleton/card-list';

export default async function Pages() {
  const initialData = await api.threads.getLikeThreads();

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadLikeList initialData={initialData} />;
    </React.Suspense>
  );
}
