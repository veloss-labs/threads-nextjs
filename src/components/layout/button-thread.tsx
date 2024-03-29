'use client';
import React, { useCallback } from 'react';
import { type NavItem } from '~/constants/nav';
import { useMainLinkActive } from '~/libs/hooks/useMainLinkActive';
import useNavigateThreanForm from '~/libs/hooks/useNavigateThreanForm';
import { cn } from '~/utils/utils';
import { Icons } from '~/components/icons';

interface ButtonThreadProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonThread({ item, type }: ButtonThreadProps) {
  const { isActive, href } = useMainLinkActive({ item });

  const { handleHref, isPending } = useNavigateThreanForm();

  const onClick = useCallback(() => {
    handleHref();
  }, [handleHref]);

  return (
    <button
      type="button"
      role="link"
      data-href={item.disabled ? '#' : href}
      tabIndex={isActive ? 0 : -1}
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
      onClick={onClick}
    >
      {isPending ? (
        <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
      ) : (
        <item.icon />
      )}
    </button>
  );
}
