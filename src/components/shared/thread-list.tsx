'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useLayoutEffect, useEffect } from 'react';
import last from 'lodash-es/last';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import ThreadItem from '~/components/shared/thread-item';
import { QUERIES_KEY } from '~/constants/constants';
import { getThreadsApi } from '~/services/threads/threads.api';
import useBeforeUnload from '~/libs/hooks/useBeforeUnload';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { isBrowser } from '~/libs/browser/dom';
import { isString } from '~/utils/assertion';

const useSSRLayoutEffect = !isBrowser ? () => {} : useLayoutEffect;

const key = '@threads::scroll';

export default function ThreadList() {
  const $virtuoso = useRef<VirtuosoHandle>(null);
  const cacheTop = useRef<number | null>(null);

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

  const currentCount = list.length;

  const loadMore = (index: number) => {
    console.log('loadMore', index);
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
    cacheTop.current = top;
    return () => {
      sessionStorage.removeItem(key);
    };
  }, [hydrating]);

  // useEffect(() => {
  //   console.log('currentCount', currentCount);
  //   const $api = $virtuoso.current;
  //   if (!$api) return;

  //   if (cacheTop.current) {
  //     $api.scrollTo?.({
  //       top: cacheTop.current,
  //       behavior: 'smooth',
  //     });
  //   }
  // }, [currentCount]);

  const lastItem = last(data?.pages ?? []);

  console.log('cacheTop.current', cacheTop.current);

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
      // totalListHeightChanged={() => {
      //   if (!mounted) {
      //     // TODO: 스크롤 버벅임
      //     scheduleMicrotask(() => {
      //       flushSync(() => {
      //         setMounted(true);
      //       });
      //     });
      //   }
      // }}
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
