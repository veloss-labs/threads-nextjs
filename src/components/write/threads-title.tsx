'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { PAGE_ENDPOINTS } from '~/constants/constants';

export default function ThreadsTitle() {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.replace(PAGE_ENDPOINTS.ROOT);
  }, [router]);

  return (
    <div className="flex flex-row items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onClick}>
        <Icons.chevronLeft className="h-6 w-6" />
      </Button>
      <h3 className="font-semibold leading-none tracking-tight">
        새로운 스레드
      </h3>
    </div>
  );
}
