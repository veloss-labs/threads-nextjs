'use client';
import React, { useDeferredValue, useState, useCallback } from 'react';
import SearchInput from '~/components/search/search-input';
import SearchWapper from '~/components/search/search-wrapper';
import SearchUserList from '~/components/shared/search-user-list';
import SkeletonCardUserList from '~/components/skeleton/card-user-list';

interface Props {
  initialKeyword?: string;
  initialData?: any;
}

export default function Search({ initialKeyword, initialData }: Props) {
  const [query, setQuery] = useState(initialKeyword ?? '');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <>
      <SearchInput value={query} onChange={onChange} />
      <SearchWapper>
        <React.Suspense fallback={<SkeletonCardUserList />}>
          <SearchUserList keyword={deferredQuery} initialData={initialData} />
        </React.Suspense>
      </SearchWapper>
    </>
  );
}
