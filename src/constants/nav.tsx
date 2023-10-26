'use client';
import type { LucideIcon } from 'lucide-react';
import { Icons } from '~/components/icons';

export type NavItem = {
  type: 'link' | 'popup' | 'myPage';
  title: string;
  href?: string;
  disabled?: boolean;
  icon: LucideIcon;
};

export const NAV_CONFIG = {
  mainNav: [
    {
      type: 'link',
      title: 'Home',
      href: '/',
      icon: Icons.home,
    },
    {
      type: 'link',
      title: 'Search',
      href: '/search',
      icon: Icons.search,
    },
    {
      type: 'popup',
      title: 'New Thread',
      icon: Icons.pen,
    },
    {
      type: 'link',
      title: 'Activity',
      href: '/activity',
      icon: Icons.heart,
    },
    {
      type: 'myPage',
      title: 'My Page',
      icon: Icons.user,
    },
  ] as NavItem[],
};
