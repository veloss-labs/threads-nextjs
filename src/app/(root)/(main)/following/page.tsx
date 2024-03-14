import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const initialData = await api.threads.getItems({
    type: 'follow',
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadList initialData={initialData} type="follow" />
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
