'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export default function ThreadsTitle() {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex flex-row items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onClick}>
        <Icons.chevronLeft className="size-6" />
      </Button>
      <h3 className="font-semibold leading-none tracking-tight">프로필 편집</h3>
    </div>
  );
}
