'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useSearchParams,
  useRouter,
  useSelectedLayoutSegment,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '~/utils/utils';
import { NAV_CONFIG, NavItem } from '~/constants/nav';
import {
  MODAL_TYPE,
  PAGE_ENDPOINTS,
  URL_STATE_KEY,
} from '~/constants/constants';
import { useCreateQueryString } from '~/libs/hooks/useCreateQueryString';
import ThreadsDialog from '../write/threads-dialog';

export default function MobileFooterNav() {
  return (
    <nav className="fixed bottom-0 z-40 flex w-full items-center justify-around border-t bg-white py-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 md:hidden">
      {NAV_CONFIG.mainNav.map((item, index) => (
        <div key={index} className="relative w-max">
          <MobileFooterNav.Item item={item} />
        </div>
      ))}
    </nav>
  );
}

interface ItemProps {
  item: NavItem;
}

MobileFooterNav.Item = function Item({ item }: ItemProps) {
  switch (item.type) {
    case 'link': {
      return <MobileFooterNav.Link item={item} />;
    }
    case 'popup': {
      return <MobileFooterNav.Popup item={item} />;
    }
    case 'myPage': {
      return <MobileFooterNav.MyPage item={item} />;
    }
    default: {
      return null;
    }
  }
};

interface ItemProps {
  item: NavItem;
}

MobileFooterNav.Link = function Item({ item }: ItemProps) {
  const segment = useSelectedLayoutSegment();
  const href = item.href as string;
  const isActive =
    segment === null && href === '/'
      ? true
      : segment && href.startsWith(`/${segment}`)
      ? true
      : false;

  return (
    <Link
      href={item.disabled ? '#' : href}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};

MobileFooterNav.Popup = function Item({ item }: ItemProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { createQueryString } = useCreateQueryString();

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      const path = `${pathname}?${createQueryString(
        URL_STATE_KEY.modal,
        MODAL_TYPE.thread,
        isOpen ? 'add' : 'remove',
      )}`;
      router.replace(path);
    },
    [router, pathname, createQueryString],
  );

  const open = searchParams.get(URL_STATE_KEY.modal) === MODAL_TYPE.thread;

  return (
    <ThreadsDialog isMobile open={open} onOpenChange={onOpenChange} {...item} />
  );
};

MobileFooterNav.MyPage = function Item({ item }: ItemProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = useSession();

  if (!data || !data.user) return null;

  const href = PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id);

  const isActive = segment && href.startsWith(`/${segment}`) ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id)}
      className={cn(
        'h-10 p-4 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};
