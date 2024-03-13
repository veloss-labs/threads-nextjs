'use client';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import UserItem from '~/components/shared/user-item';

interface UserListProps {
  initialData?: any;
  keyword?: string;
}

const CLIENT_LIMIT_SIZE = 10;
const CLIENT_DATA_OVERSCAN = 5;
const MIN_ITEM_SIZE = 40;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') || '0'),
  cursor: searchParams.get('cursor') || null,
  limit: Number(searchParams.get('limit') || CLIENT_LIMIT_SIZE.toString()),
});

export default function UserList({ keyword, initialData }: UserListProps) {
  const seachParams = useSearchParams();
  const hydrating = useIsHydrating('[data-hydrating-signal]');
  const initialLength = initialData?.list?.length ?? CLIENT_DATA_OVERSCAN;

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.users.getSearchUsers.useSuspenseInfiniteQuery(
      {
        keyword,
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

  const initialRect = useMemo(() => {
    return {
      width: 0,
      height: MIN_ITEM_SIZE * initialLength,
    };
  }, [initialLength]);

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
        className="relative w-full space-y-6"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);

          if (isLoaderRow) {
            return (
              <div
                key={`items:loading:${virtualRow.index}`}
                style={{
                  height: virtualRow.size,
                  position: 'absolute',
                  top: virtualRow.start,
                  left: 0,
                  right: 0,
                }}
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              </div>
            );
          }

          if (!item) {
            return null;
          }

          return (
            <div
              key={`users:${item.id}`}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${
                  virtualRow.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <UserItem item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
