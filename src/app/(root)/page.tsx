import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import { threadService } from '~/services/threads/threads.server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '~/services/query/get-query-client';
import { QUERIES_KEY } from '~/constants/constants';

export default async function Pages() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERIES_KEY.threads.root,
    initialPageParam: null,
    queryFn: async () => {
      return await threadService.getItems({
        limit: 10,
      });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadList />
    </HydrationBoundary>
  );
}
