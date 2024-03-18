import React from 'react';
import { api } from '~/services/trpc/server';
import ThreadBookmarkList from '~/components/shared/thread-bookmarks-list';
import SkeletonCardList from '~/components/skeleton/card-thread-list';

export default async function Pages() {
  const initialData = await api.threads.getBookmarks({
    limit: 10,
  });

  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <ThreadBookmarkList initialData={initialData} />
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
