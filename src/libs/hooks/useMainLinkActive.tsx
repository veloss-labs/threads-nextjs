'use client';
import { usePathname } from 'next/navigation';
import { type NavItem, type ScrollNavItem } from '~/constants/nav';

interface UseMainLinkActiveOptions {
  item: NavItem;
}

export function useMainLinkActive({ item }: UseMainLinkActiveOptions) {
  const pathname = usePathname();

  const rootHref = item.href;
  const relationHrefs = new Set<string>();

  if (rootHref) {
    relationHrefs.add(rootHref);
  }

  if (item.relationHrefs) {
    item.relationHrefs.forEach((href) => relationHrefs.add(href));
  }

  const href =
    Array.from(relationHrefs).find((href) => href === pathname) ?? '#';

  const Icon = item.relationIcons?.[href] ?? item.icon;

  const isActive = relationHrefs.has(pathname);

  return {
    href: item.href ? item.href : '#',
    Icon,
    isActive,
  };
}

interface UseScrollNavLinkActiveOptions {
  item: ScrollNavItem;
}

export function useScrollNavLinkActive({
  item,
}: UseScrollNavLinkActiveOptions) {
  const pathname = usePathname();

  const isActive = item.href === pathname;

  return {
    isActive,
  };
}
