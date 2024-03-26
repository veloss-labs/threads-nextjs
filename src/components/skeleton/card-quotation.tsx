import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function CardQuotation() {
  return (
    <div className="flex w-full py-4">
      <div className="flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-4 w-[30px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <div className="line-clamp-2">
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    </div>
  );
}
