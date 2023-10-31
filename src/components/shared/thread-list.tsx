'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import last from 'lodash-es/last';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import ThreadItem from '~/components/shared/thread-item';
import { QUERIES_KEY } from '~/constants/constants';
import { getThreadsApi } from '~/services/threads/threads.api';
import useBeforeUnload from '~/libs/hooks/useBeforeUnload';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { isBrowser } from '~/libs/browser/dom';
import { isString } from '~/utils/assertion';
import { scheduleMicrotask } from '~/libs/browser/schedule';

const useSSRLayoutEffect = !isBrowser ? () => {} : useLayoutEffect;

const key = '@threads::scroll';

export default function ThreadList() {
  const $virtuoso = useRef<VirtuosoHandle>(null);
  const cacheTop = useRef<number | null>(null);

  const getTop = useCallback(() => {
    return cacheTop.current;
  }, []);

  const setTop = useCallback((top: number | null) => {
    cacheTop.current = top;
  }, []);

  const hydrating = useIsHydrating('[data-hydrating-signal]');

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: QUERIES_KEY.threads.root,
    queryFn: async ({ pageParam }) => {
      return await getThreadsApi({
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

  useBeforeUnload(() => {
    const $api = $virtuoso.current;
    if (!$api) return;
    $api.getState((state) => {
      sessionStorage.setItem(key, state.scrollTop?.toString());
    });
  });

  useSSRLayoutEffect(() => {
    if (!hydrating) return;
    const $api = $virtuoso.current;
    if (!$api) return;

    const _scrollTop = sessionStorage.getItem(key);
    if (!_scrollTop) return;
    const top = isString(_scrollTop) ? Number(_scrollTop) : _scrollTop;
    if (isNaN(top)) return;
    $api.scrollTo?.({
      top: top,
      behavior: 'smooth',
    });
    setTop(top);
    return () => {
      sessionStorage.removeItem(key);
    };
  }, [hydrating]);

  const lastItem = last(data?.pages ?? []);

  return (
    <Virtuoso
      ref={$virtuoso}
      data-hydrating-signal
      useWindowScroll
      style={{ height: '100%' }}
      data={list}
      totalCount={lastItem?.totalCount ?? 0}
      computeItemKey={(index, item) => {
        return `threads-${item.id}-${index}`;
      }}
      overscan={10}
      initialItemCount={list.length - 1}
      totalListHeightChanged={(height) => {
        scheduleMicrotask(() => {
          const cacheTopValue = getTop();
          if (cacheTopValue === null) return;
          if (cacheTopValue > height) return;
          const $api = $virtuoso.current;
          if (!$api) return;
          $api.scrollTo?.({
            top: cacheTopValue,
            behavior: 'smooth',
          });
          setTop(null);
        });
      }}
      itemContent={(_, item) => {
        return <ThreadItem item={item} />;
      }}
      components={{
        Footer: () => <div className="h-20"></div>,
      }}
      endReached={loadMore}
    />
  );
}
