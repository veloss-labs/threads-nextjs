'use client';
import type { LucideIcon } from 'lucide-react';
import { Icons } from '~/components/icons';
import { PAGE_ENDPOINTS } from './constants';

export type NavItem = {
  id: 'home' | 'search' | 'thread' | 'activity' | 'myPage';
  type: 'link' | 'myPage' | 'home';
  title: string;
  href?: string;
  relationHrefs?: string[];
  disabled?: boolean;
  icon: LucideIcon;
  relationIcons?: LucideIcon[];
};

export const NAV_CONFIG = {
  mainNav: [
    {
      id: 'home',
      type: 'home',
      title: 'Home',
      href: PAGE_ENDPOINTS.ROOT,
      icon: Icons.home,
      relationHrefs: [PAGE_ENDPOINTS.ROOT, PAGE_ENDPOINTS.FOLLOWING],
      relationIcons: [Icons.home, Icons.users],
    },
    {
      id: 'search',
      type: 'link',
      title: 'Search',
      href: '/search',
      icon: Icons.search,
    },
    {
      id: 'thread',
      type: 'link',
      title: 'New Thread',
      href: '/threads',
      icon: Icons.pen,
    },
    {
      id: 'activity',
      type: 'link',
      title: 'Activity',
      href: '/activity',
      icon: Icons.heart,
    },
    {
      id: 'myPage',
      type: 'myPage',
      title: 'My Page',
      icon: Icons.user,
    },
  ] as NavItem[],
};
