'use client';
import React from 'react';
import Link from 'next/link';
import { Icons } from '~/components/icons';
import { NAV_CONFIG } from '~/constants/nav';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import ButtonGroup from '~/components/layout/button-group';
import ButtonHeaderMenu from './button-header-menu';

export default function MainNav() {
  return (
    <>
      <Link
        href={PAGE_ENDPOINTS.ROOT}
        className="flex w-full items-center justify-center sm:block sm:w-auto"
      >
        <Icons.threadsWhite className="hidden size-8 dark:block" />
        <Icons.threads className="block size-8 dark:hidden" />
      </Link>

      <nav className="hidden gap-4 sm:flex lg:gap-6">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <ButtonGroup key={index} item={item} type="header" />
        ))}
      </nav>

      <nav>
        <ButtonHeaderMenu />
      </nav>
    </>
  );
}
