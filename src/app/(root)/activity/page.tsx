import React from 'react';
import ThreadLikesList from '~/components/shared/thread-likes-list';
import { threadService } from '~/services/threads/threads.server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '~/services/query/get-query-client';
import { QUERIES_KEY } from '~/constants/constants';
import { auth } from '~/services/auth';
import { notFound } from 'next/navigation';

export default async function Pages() {
  const session = await auth();
  if (!session) {
    notFound();
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERIES_KEY.threads.likes.root,
    initialPageParam: null,
    queryFn: async () => {
      return await threadService.getLikes(session?.user?.id, {
        limit: 10,
      });
    },
  });

  const data = await queryClient.getQueryData<any>(
    QUERIES_KEY.threads.likes.root,
  );

  const totalCount =
    data?.pages
      ?.map((page: any) => page?.totalCount)
      .flat()
      ?.at(0) ?? 0;

  const isEmptyData = totalCount === 0;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isEmptyData ? <>Empty</> : <ThreadLikesList />}
    </HydrationBoundary>
  );
}
