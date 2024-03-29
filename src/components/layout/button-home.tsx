'use client';
import Link from 'next/link';
import React from 'react';
import { type NavItem } from '~/constants/nav';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';
import { cn } from '~/utils/utils';

interface ButtonHomeProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonHome({ item, type }: ButtonHomeProps) {
  const { isActive, href, Icon } = useMainLinkActive({ item });

  return (
    <Link
      href={item.disabled ? '#' : href}
      scroll={true}
      replace={false}
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
      {Icon ? <Icon /> : <item.icon />}
    </Link>
  );
}
