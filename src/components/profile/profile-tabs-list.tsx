'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useCreateQueryString } from '~/libs/hooks/useCreateQueryString';

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

  const value = searchParams.get('tab') || 'threads';

  const onValueChange = useCallback(
    (value: string) => {
      const path = `${pathname}?${createQueryString('tab', value, 'add')}`;
      router.replace(path);
    },
    [router, pathname, createQueryString],
  );

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full">
        <TabsTrigger value="threads" className="flex-1">
          스레드
        </TabsTrigger>
        <TabsTrigger value="comments" className="flex-1" disabled>
          답글
        </TabsTrigger>
        <TabsTrigger value="reposts" className="flex-1" disabled>
          리포스트
        </TabsTrigger>
      </TabsList>
      <TabsContent value="threads">{threads}</TabsContent>
      <TabsContent value="comments">{comments}</TabsContent>
      <TabsContent value="reposts">{reposts}</TabsContent>
    </Tabs>
  );
}
