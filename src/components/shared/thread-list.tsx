'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ThreadItem from '~/components/shared/thread-item';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import SkeletonCard from '~/components/skeleton/card';

interface ThreadListProps {
  totalCount?: number;
  initialData?: any;
  userId?: string;
}

const CLIENT_LIMIT_SIZE = 30;
const CLIENT_DATA_OVERSCAN = 10;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') || '0'),
  cursor: searchParams.get('cursor') || null,
  limit: Number(searchParams.get('limit') || CLIENT_LIMIT_SIZE.toString()),
});

export default function ThreadList({ initialData, userId }: ThreadListProps) {
  const total = initialData?.totalCount;
  const seachParams = useSearchParams();
  const hydrating = useIsHydrating('[data-hydrating-signal]');

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.threads.getThreads.useSuspenseInfiniteQuery(
      {
        userId,
      },
      {
        initialData: () => {
          if (initialData) {
            return {
              pageParams: [undefined],
              pages: [initialData],
            };
          }
        },
        getNextPageParam: (lastPage) => {
          return lastPage?.hasNextPage && lastPage?.endCursor
            ? lastPage?.endCursor
            : null;
        },
      },
    );

  const totalCount = data?.pages?.at(0)?.totalCount ?? 0;
  const flatList = data?.pages?.map((page) => page?.list).flat() ?? [];

  const { start, cursor, limit } = getCursorLimit(seachParams);
  const [initialStart] = useState(() => start);
  const isMountedRef = useRef(false);

  const $list = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: total ?? totalCount,
    estimateSize: () => 250,
    overscan: CLIENT_DATA_OVERSCAN,
    scrollMargin: getTargetElement($list)?.offsetTop ?? 0,
    initialRect: {
      width: 0,
      height: 800,
    },
  });

  const virtualizerList = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualizerList].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= flatList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasNextPage,
    fetchNextPage,
    flatList.length,
    isFetchingNextPage,
    virtualizerList,
  ]);

  return (
    <div ref={$list}>
      <div className="relative w-full">
        {virtualizerList.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);

          if (!item) {
            return null;
          }

          if (isLoaderRow) {
            return (
              <SkeletonCard key={`items:loading:${item.id}:${item.type}`} />
            );
          }

          return (
            <ThreadItem key={`items:${item.id}:${item.type}`} item={item} />
          );
        })}
      </div>
    </div>
  );
}
