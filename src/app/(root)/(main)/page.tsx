import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import SkeletonCardList from '~/components/skeleton/card-list';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const initialData = await api.threads.getThreads({
    type: 'recommendation',
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadList initialData={initialData} type="recommendation" />
    </React.Suspense>
  );
}
