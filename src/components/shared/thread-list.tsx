'use client';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ThreadItem from '~/components/shared/thread-item';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { getTargetElement, isBrowser } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';

import { useWindowVirtualizer } from '@tanstack/react-virtual';

const useSSRLayoutEffect = !isBrowser ? () => {} : useLayoutEffect;

interface ThreadListProps {
  totalCount?: number;
  userId?: string;
  initialData?: any;
}

const CLIENT_LIMIT_SIZE = 30;
const CLIENT_DATA_OVERSCAN = 10;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') || '0'),
  cursor: searchParams.get('cursor') || null,
  limit: Number(searchParams.get('limit') || CLIENT_LIMIT_SIZE.toString()),
});

export default function ThreadList({ userId, initialData }: ThreadListProps) {
  const total = initialData?.totalCount ?? 0;
  const seachParams = useSearchParams();
  const hydrating = useIsHydrating('[data-hydrating-signal]');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.threads.getThreads.useInfiniteQuery(
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

  const flatList = data?.pages?.map((page) => page?.list).flat() ?? [];

  const { start, cursor, limit } = getCursorLimit(seachParams);
  const [initialStart] = useState(() => start);
  const isMountedRef = useRef(false);

  const $list = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: total,
    estimateSize: () => 250,
    overscan: CLIENT_DATA_OVERSCAN,
    scrollMargin: getTargetElement($list)?.offsetTop ?? 0,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= flatList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      console.log('fetchNextPage');
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    flatList.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div ref={$list}>
      <div className="relative w-full">
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);
          if (!item) {
            return null;
          }

          if (isLoaderRow) {
            return (
              <div
                key={`thrads:${item.id}:${item.type}`}
                style={{
                  height: virtualRow.size,
                  position: 'absolute',
                  top: virtualRow.start,
                  left: 0,
                  right: 0,
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading...</div>
                </div>
              </div>
            );
          }

          return (
            <ThreadItem key={`thrads:${item.id}:${item.type}`} item={item} />
          );
        })}
      </div>
    </div>
  );
}
