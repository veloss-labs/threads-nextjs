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

  const data = await queryClient.getQueryData<
    ReturnType<typeof threadService.getItems>
  >(QUERIES_KEY.threads.root);

  const isEmptyData = (data?.totalCount ?? 0) === 0;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isEmptyData ? <>Empty</> : <ThreadList type="root" />}
    </HydrationBoundary>
  );
}
