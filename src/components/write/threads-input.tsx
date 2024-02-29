'use client';
import React, { useCallback } from 'react';
import Avatars from '~/components/shared/avatars';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import Link from 'next/link';
import { type Session } from 'next-auth';

interface ThreadsInputProps {
  session: Session;
}

export default function ThreadsInput({ session }: ThreadsInputProps) {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(PAGE_ENDPOINTS.THREADS.ROOT);
  }, [router]);

  return (
    <div className="hidden w-full border-b py-8 md:block">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-auto items-center space-x-4">
          <Link href={PAGE_ENDPOINTS.MY_PAGE.ID(session.user.id)}>
            <Avatars
              src={undefined}
              alt={`${session.user.username} profile picture`}
              fallback="T"
            />
          </Link>
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
