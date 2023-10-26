'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useSearchParams,
  useRouter,
  useSelectedLayoutSegment,
} from 'next/navigation';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import { NAV_CONFIG, NavItem } from '~/constants/nav';
import {
  MODAL_TYPE,
  PAGE_ENDPOINTS,
  SHEET_TYPE,
  URL_STATE_KEY,
} from '~/constants/constants';
import { useSession } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { useCreateQueryString } from '~/libs/hooks/useCreateQueryString';
import { MEDIA_QUERY, useMediaQuery } from '~/libs/hooks/useMediaQuery';
import ThreadsDialog from '../write/threads-dialog';

export default function MainNav() {
  return (
    <>
      <Link
        href={PAGE_ENDPOINTS.ROOT}
        className="items-center space-x-2 md:flex"
      >
        <Icons.threads className="h-8 w-8" />
      </Link>
      <div className="flex gap-6 md:gap-10">
        <nav className="hidden gap-6 md:flex">
          {NAV_CONFIG.mainNav.map((item, index) => (
            <MainNav.Item key={index} item={item} />
          ))}
        </nav>
      </div>
      <nav>
        <MainNav.Menu />
      </nav>
    </>
  );
}

interface ItemProps {
  item: NavItem;
}

MainNav.Item = function Item({ item }: ItemProps) {
  switch (item.type) {
    case 'link': {
      return <MainNav.Link item={item} />;
    }
    case 'popup': {
      return <MainNav.Popup item={item} />;
    }
    case 'myPage': {
      return <MainNav.MyPage item={item} />;
    }
    default: {
      return null;
    }
  }
};

MainNav.Link = function Item({ item }: ItemProps) {
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
        'px-8 py-5 mx-[2px] my-1 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};

MainNav.Popup = function Item({ item }: ItemProps) {
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

  return <ThreadsDialog open={open} onOpenChange={onOpenChange} {...item} />;
};

MainNav.MyPage = function Item({ item }: ItemProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = useSession();

  if (!data || !data.user) return null;

  const href = PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id);

  const isActive = segment && href.startsWith(`/${segment}`) ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id)}
      className={cn(
        'px-8 py-5 mx-[2px] my-1 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      <item.icon />
    </Link>
  );
};

MainNav.Menu = function Item() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isMobile = useMediaQuery(MEDIA_QUERY.small, false);

  const { createQueryString } = useCreateQueryString();

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      const path = `${pathname}?${createQueryString(
        URL_STATE_KEY.sheet,
        SHEET_TYPE.menu,
        isOpen ? 'add' : 'remove',
      )}`;
      router.replace(path);
    },
    [router, pathname, createQueryString],
  );

  const open = searchParams.get(URL_STATE_KEY.sheet) === SHEET_TYPE.menu;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        className={cn(
          'hover:text-foreground leading-tight',
          open ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        <Icons.alignLeft />
      </SheetTrigger>
      <SheetContent side={isMobile ? 'bottom' : 'right'}>
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
