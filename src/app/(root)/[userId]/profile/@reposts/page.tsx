import React from 'react';
import ThreadRepostList from '~/components/shared/thread-repost-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { api } from '~/services/trpc/server';

interface Props {
  params: {
    userId: string;
  };
}

export default async function Pages({ params }: Props) {
  const initialData = await api.threads.getReposts({
    limit: 10,
    userId: params.userId,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadRepostList initialData={initialData} userId={params.userId} />
    </React.Suspense>
  );
}
