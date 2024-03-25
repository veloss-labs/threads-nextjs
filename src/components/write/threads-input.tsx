'use client';
import React, { useCallback } from 'react';
import Avatars from '~/components/shared/avatars';
import { Button } from '~/components/ui/button';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import Link from 'next/link';
import { type Session } from 'next-auth';
import { Icons } from '~/components/icons';
import useNavigateThreanForm from '~/libs/hooks/useNavigateThreanForm';

interface ThreadsInputProps {
  session: Session;
}

export default function ThreadsInput({ session }: ThreadsInputProps) {
  const { isPending, handleHref } = useNavigateThreanForm();

  const onClick = useCallback(() => {
    handleHref();
  }, [handleHref]);

  return (
    <div className="hidden w-full border-b py-8 md:block">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-auto items-center space-x-4">
          <Link href={PAGE_ENDPOINTS.USER.ID(session.user.id)}>
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
        <Button
          type="button"
          variant="default"
          className="ml-auto"
          size="sm"
          disabled={isPending}
          onClick={onClick}
        >
          {isPending && (
            <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
          )}
          게시
        </Button>
      </div>
    </div>
  );
}
