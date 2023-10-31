'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useLayoutEffect, useState } from 'react';
import last from 'lodash-es/last';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import ThreadItem from '~/components/shared/thread-item';
import { QUERIES_KEY } from '~/constants/constants';
import { getThreadsApi } from '~/services/threads/threads.api';
import useBeforeUnload from '~/libs/hooks/useBeforeUnload';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { isBrowser } from '~/libs/browser/dom';
import { scheduleMicrotask } from '~/libs/browser/schedule';
import { flushSync } from 'react-dom';

const useSSRLayoutEffect = !isBrowser ? () => {} : useLayoutEffect;

const key = '@threads::scroll';

export default function ThreadList() {
  const $virtuoso = useRef<VirtuosoHandle>(null);

  const hydrating = useIsHydrating('[data-hydrating-signal]');
  const [mounted, setMounted] = useState(false);

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
    if (mounted) {
      const $api = $virtuoso.current;
      if (!$api) return;

      const infiniteScrollTop = sessionStorage.getItem(key);
      if (!infiniteScrollTop) return;

      console.log('infiniteScrollTop', infiniteScrollTop);

      $api.scrollTo?.({
        top: parseInt(infiniteScrollTop),
        behavior: 'smooth',
      });
    }

    return () => {
      sessionStorage.removeItem(key);
    };
  }, [hydrating, mounted]);

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
      totalListHeightChanged={() => {
        if (!mounted) {
          // TODO: 스크롤 버벅임
          scheduleMicrotask(() => {
            flushSync(() => {
              setMounted(true);
            });
          });
        }
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
