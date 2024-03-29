'use client';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { type NavItem } from '~/constants/nav';
import { api } from '~/services/trpc/react';
import { cn } from '~/utils/utils';

interface ButtonMyPageProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonMyPage({ item, type }: ButtonMyPageProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = api.auth.getRequireSession.useQuery();

  const href = data ? PAGE_ENDPOINTS.USER.ID(data.user.id) : '#';

  const isActive = segment && href.startsWith(`/${segment}`) ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        type === 'header'
          ? 'px-6 py-3 lg:px-8 lg:py-5 mx-[2px] my-1 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm'
          : undefined,
        type === 'footer'
          ? 'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm'
          : undefined,
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
}
