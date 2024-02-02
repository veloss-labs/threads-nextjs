import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import ThreadsInput from '~/components/write/threads-input';
import { threadService } from '~/services/threads/threads.server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '~/services/query/get-query-client';
import { QUERIES_KEY } from '~/constants/constants';
import { getSession } from '~/services/auth';

export default async function Pages() {
  // const session = await getSession();

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERIES_KEY.threads.root,
    initialPageParam: null,
    queryFn: async () => {
      return await threadService.getItems(
        {
          limit: 10,
          type: 'thread',
        },
        // session?.user.id,
      );
    },
  });

  const data = await queryClient.getQueryData<any>(QUERIES_KEY.threads.root);

  const totalCount =
    data?.pages
      ?.map((page: any) => page?.totalCount)
      .flat()
      ?.at(0) ?? 0;

  const isEmptyData = totalCount === 0;

  return (
    <>
      <ThreadsInput />
      <HydrationBoundary state={dehydrate(queryClient)}>
        {isEmptyData ? <>Empty</> : <ThreadList type="root" />}
      </HydrationBoundary>
    </>
  );
}
