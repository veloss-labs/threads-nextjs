'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import last from 'lodash-es/last';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import UserItem from '~/components/shared/user-item';
import { QUERIES_KEY } from '~/constants/constants';
import { getSearchApi } from '~/services/search/search.api';
import useBeforeUnload from '~/libs/hooks/useBeforeUnload';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { isBrowser } from '~/libs/browser/dom';
import { isEmpty } from '~/utils/assertion';

const useSSRLayoutEffect = !isBrowser ? () => {} : useLayoutEffect;

interface UserListProps {
  type: 'root';
  q?: string;
}

type Cache = {
  top: number;
  pages: string[];
};

export default function UserList({ q, type = 'root' }: UserListProps) {
  const $virtuoso = useRef<VirtuosoHandle>(null);
  const $cache = useRef<Cache | null>(null);

  const key = useMemo(() => {
    return `@users::scroll::${type}`;
  }, [type]);

  const getCache = useCallback(() => {
    return $cache.current;
  }, []);

  const setCache = useCallback((data: Cache | null) => {
    $cache.current = data;
  }, []);

  const hydrating = useIsHydrating('[data-hydrating-signal]');

  const queryKey = useMemo(() => {
    return QUERIES_KEY.users.search(q);
  }, [q]);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      return await getSearchApi({
        ...(q ? { q } : {}),
        limit: 10,
        cursor: pageParam ? pageParam : undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNextPage && lastPage?.endCursor
        ? lastPage?.endCursor
        : null;
    },
  });

  console.log(data);

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
      sessionStorage.setItem(
        key,
        JSON.stringify({
          top: state.scrollTop,
          pages: data?.pages
            ?.filter((page) => page?.endCursor)
            ?.map((page) => page.endCursor)
            ?.filter(Boolean),
        }),
      );
    });
  });

  useSSRLayoutEffect(() => {
    if (hydrating) {
      const _data = JSON.parse(sessionStorage.getItem(key) || '{}') as Cache;
      if (_data) setCache(_data);
    }
    return () => {
      sessionStorage.removeItem(key);
    };
  }, [hydrating]);

  const fetchScrollRestoration = async () => {
    const el = document
      .querySelector('[data-hydrating-signal]')
      ?.querySelector('[data-test-id="virtuoso-item-list"]');

    const _data = getCache();
    if (_data && !isEmpty(_data)) {
      const _pages = data?.pages ?? [];
      const currentCursor = _pages.at(_pages.length - 1)?.endCursor;
      const _cursorIndex = _data.pages.findIndex(
        (page) => page === currentCursor,
      );
      const _pagesAfterCursor = _data.pages.slice(_cursorIndex + 1);
      for (const page of _pagesAfterCursor) {
        await fetchNextPage();
      }
      setCache(null);
      $virtuoso.current?.scrollTo({
        top: _data.top,
        behavior: 'smooth',
      });
    }
  };

  useSSRLayoutEffect(() => {
    if (hydrating) fetchScrollRestoration();
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
        return `${type}-users-${item.id}-${index}`;
      }}
      overscan={10}
      initialItemCount={list.length - 1}
      itemContent={(_, item) => {
        return <UserItem item={item} />;
      }}
      components={{
        Footer: () => <div className="h-20"></div>,
      }}
      endReached={loadMore}
    />
  );
}
