import React from 'react';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { cn } from '~/utils/utils';
import { Card } from '~/components/ui/card';

export default function SkeletonCard() {
  return (
    <Card className="m-3 mx-auto overflow-hidden rounded-none border-x-0 border-b border-t-0 shadow-none dark:bg-background">
      <div className="md:flex">
        <div className="md:shrink-0">
          <span className="size-[192px] rounded-md bg-muted object-cover md:w-48" />
        </div>
        <div className="w-full py-2">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center">
              <div className="size-12 animate-pulse rounded-full bg-gray-200" />
              <div className="ml-4 flex w-full flex-row">
                <div className="space-y-1">
                  <div className="text-base font-semibold tracking-wide text-black dark:text-white">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-300">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-3">
                  <div
                    className="text-sm text-gray-400 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                  </div>
                  <Button variant="link" size="icon" className="!mr-2">
                    <Icons.moreHorizontal className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="flex max-h-[50px] animate-pulse flex-col space-y-4">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 py-4">
            <div className="flex items-center space-x-1">
              {/* <Button size="sm" variant="link">
                <Icons.messageSquare className="h-4 w-4" />
              </Button> */}
              <Button size="sm" variant="link">
                <Icons.heart className={cn('h-4 w-4')} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
