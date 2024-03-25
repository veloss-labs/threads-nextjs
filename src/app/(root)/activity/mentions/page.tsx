import React from 'react';
import { api } from '~/services/trpc/server';
import SkeletonCardList from '~/components/skeleton/card-thread-list';

export default async function Pages() {
  return (
    <React.Suspense fallback={<SkeletonCardList />}>
      <div>테스트</div>
    </React.Suspense>
  );
}

export const dynamic = 'force-dynamic';
