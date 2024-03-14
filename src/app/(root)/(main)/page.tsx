import React from 'react';
import ThreadRecommendationsList from '~/components/shared/thread-recommendations-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const initialData = await api.threads.getRecommendations({
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadRecommendationsList initialData={initialData} />
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
