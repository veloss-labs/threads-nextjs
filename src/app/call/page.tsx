import React from 'react';
import { api } from '~/services/trpc/server';
import ThreadLikeList from '~/components/shared/thread-likes-list';
import SkeletonCardList from '~/components/skeleton/card-list';

export default async function Pages() {
  const initialData = await api.threads.getRecommendations({
    type: 'recommendation',
    limit: 10,
  });

  console.log('initialData', initialData);

  return <>테스트</>;
}
