'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import last from 'lodash-es/last';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import ThreadItem from '~/components/shared/thread-item';
import { QUERIES_KEY } from '~/constants/constants';
import { getThreadsApi } from '~/services/threads/threads.api';

export default function ThreadList() {
  const $virtuoso = useRef<VirtuosoHandle>(null);
  const $endCurorRef = useRef<string | null>(null);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: QUERIES_KEY.threads.root,
    queryFn: async ({ pageParam }) => {
      return await getThreadsApi({
        type: 'cursor',
        limit: 10,
        cursor: pageParam ? pageParam : undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage?.endCursor ?? null;
    },
  });

  const list = data?.pages?.map((page) => page?.list).flat() ?? [];

  const loadMore = (index: number) => {
    if (index <= 0) return;

    const lastData = last(data?.pages ?? []);

    if (lastData?.endCursor && lastData?.hasNextPage) {
      fetchNextPage();
    }
  };

  console.log(data);

  return (
    <Virtuoso
      ref={$virtuoso}
      useWindowScroll
      style={{ height: '100%' }}
      data={list}
      totalCount={list.length}
      overscan={5}
      initialItemCount={list.length - 1}
      itemContent={(_, item) => {
        return <ThreadItem item={item} />;
      }}
      components={{
        Footer: () => <div className="h-20"></div>,
      }}
      scrollerRef={(el) => {
        console.log(el);
      }}
      endReached={loadMore}
    />
  );
}
