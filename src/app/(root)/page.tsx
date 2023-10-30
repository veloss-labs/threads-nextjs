import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import { threadService } from '~/services/threads/threads';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '~/services/query/getQueryClient';
import { QUERIES_KEY } from '~/constants/constants';

export default async function Pages() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERIES_KEY.threads.root,
    initialPageParam: null,
    queryFn: async () => {
      return await threadService.getItems({
        type: 'cursor',
        limit: 10,
      });
    },
  });

  const data = await queryClient.getQueryData(QUERIES_KEY.threads.root);
  console.log(data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadList />
    </HydrationBoundary>
  );
}
