'use client';
import React from 'react';
import { cn } from '~/utils/utils';
import { buttonVariants } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';

export default function FloatingLink() {
  const pathname = usePathname();

  const isRoot = pathname === PAGE_ENDPOINTS.ROOT;
  const isFollowing = pathname === PAGE_ENDPOINTS.FOLLOWING;

  const href = isRoot
    ? PAGE_ENDPOINTS.FOLLOWING
    : isFollowing
      ? PAGE_ENDPOINTS.ROOT
      : PAGE_ENDPOINTS.ROOT;

  const text = isRoot
    ? '회원님을 위한 추천'
    : isFollowing
      ? '팔로잉'
      : '팔로잉';

  return (
    <div className="fixed bottom-8 left-8 z-10 hidden md:block">
      <Link
        href={href}
        role="link"
        className={cn(
          buttonVariants({
            variant: 'secondary',
            size: 'default',
            className: 'space-x-2',
          }),
        )}
      >
        <span>{text}</span>
        <Icons.arrowLeftRight />
      </Link>
    </div>
  );
}
