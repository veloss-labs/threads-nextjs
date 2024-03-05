'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useCreateQueryString } from '~/libs/hooks/useCreateQueryString';
import { cn } from '~/utils/utils';

interface ProfileTabsListProps {
  threads: React.ReactNode;
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export default function ProfileTabsList({
  threads,
  comments,
  reposts,
}: ProfileTabsListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const [isPending, startTransition] = useTransition();

  const value = searchParams.get('tab') || 'threads';

  const onValueChange = useCallback(
    (value: string) => {
      startTransition(() => {
        const path = `${pathname}?${createQueryString('tab', value, 'add')}`;
        router.replace(path);
      });
    },
    [router, pathname, createQueryString],
  );

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full">
        <TabsTrigger value="threads" className="flex-1">
          스레드
        </TabsTrigger>
        <TabsTrigger value="comments" className="flex-1">
          답글
        </TabsTrigger>
        <TabsTrigger value="reposts" className="flex-1">
          리포스트
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="threads"
        className={cn({
          'opacity-50': isPending && value === 'threads',
        })}
      >
        {threads}
      </TabsContent>
      <TabsContent
        value="comments"
        className={cn({
          'opacity-50': isPending && value === 'comments',
        })}
      >
        {comments}
      </TabsContent>
      <TabsContent
        value="reposts"
        className={cn({
          'opacity-50': isPending && value === 'reposts',
        })}
      >
        {reposts}
      </TabsContent>
    </Tabs>
  );
}
