'use client';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ThreadItem from '~/components/shared/thread-item';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import SkeletonCard from '~/components/skeleton/card-thread';
import { ThreadListQuerySchema } from '~/services/threads/threads.query';

interface ThreadListProps {
  totalCount?: number;
  initialData?: any;
  userId?: ThreadListQuerySchema['userId'];
  keyword?: ThreadListQuerySchema['keyword'];
  type?: ThreadListQuerySchema['type'];
}

const CLIENT_LIMIT_SIZE = 10;
const CLIENT_DATA_OVERSCAN = 5;
const MIN_ITEM_SIZE = 200;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') || '0'),
  cursor: searchParams.get('cursor') || null,
  limit: Number(searchParams.get('limit') || CLIENT_LIMIT_SIZE.toString()),
});

export default function ThreadList({
  initialData,
  userId,
  keyword,
  type,
}: ThreadListProps) {
  const seachParams = useSearchParams();
  const initialLength = initialData?.list?.length ?? CLIENT_DATA_OVERSCAN;

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.threads.getThreads.useSuspenseInfiniteQuery(
      {
        userId,
        keyword,
        type,
        limit: CLIENT_LIMIT_SIZE,
      },
      {
        staleTime: 2 * 60 * 1000,
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

  const initialRect = useMemo(() => {
    return {
      width: 0,
      height: MIN_ITEM_SIZE * initialLength,
    };
  }, [initialLength]);

  const totalCount = data?.pages?.at(0)?.totalCount ?? 0;
  const flatList = data?.pages?.map((page) => page?.list).flat() ?? [];

  const { start, cursor, limit } = getCursorLimit(seachParams);
  const [initialStart] = useState(() => start);
  const isMountedRef = useRef(false);

  const $list = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? flatList.length + 1 : flatList.length,
    estimateSize: () => MIN_ITEM_SIZE,
    overscan: CLIENT_DATA_OVERSCAN,
    scrollMargin: getTargetElement($list)?.offsetTop ?? 0,
    initialRect,
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
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasNextPage,
    fetchNextPage,
    flatList.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div ref={$list} data-hydrating-signal className="max-w-full">
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);
          const isEnd = totalCount === virtualRow.index + 1;

          if (isLoaderRow) {
            return (
              <div
                key={`items:loading:${virtualRow.index}`}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${
                    virtualRow.start - rowVirtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                <SkeletonCard />;
              </div>
            );
          }

          if (!item) {
            return null;
          }

          return (
            <div
              key={`items:${item.id}`}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${
                  virtualRow.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <ThreadItem item={item} />
              {isEnd && (
                <div className="w-full py-8">
                  <p className="text-center text-slate-700 dark:text-slate-300">
                    스레드를 모두 읽었습니다! 👋
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
