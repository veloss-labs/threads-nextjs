import React from 'react';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';

export default function SkeletonCardUser() {
  return (
    <div className="mx-3 my-2 flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="size-12 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-4 w-[150px] text-sm font-medium leading-none" />
          <Skeleton className="h-3 w-[100px] text-sm text-muted-foreground" />
        </div>
      </div>
      <Button variant="outline" className="ml-auto">
        팔로우
      </Button>
    </div>
  );
}
