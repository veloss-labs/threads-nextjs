'use client';
import React, { useCallback } from 'react';
import Avatars from '~/components/shared/avatars';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';

export default function ThreadsInput() {
  const router = useRouter();
  const { data } = useSession();

  const item = data?.user;

  const onClick = useCallback(() => {
    router.push(PAGE_ENDPOINTS.THREADS.ROOT);
  }, [router]);

  return (
    <div className="hidden w-full border-b py-8 md:block">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-auto items-center space-x-4">
          <Avatars
            src={item?.image ?? undefined}
            alt={`${item?.username} profile picture`}
            fallback="T"
          />
          <div className="w-full cursor-text" onClick={onClick}>
            <p className="text-base text-muted-foreground">
              스레드를 시작하세요....
            </p>
          </div>
        </div>
        <Button variant="default" className="ml-auto" size="sm" disabled>
          게시
        </Button>
      </div>
    </div>
  );
}
