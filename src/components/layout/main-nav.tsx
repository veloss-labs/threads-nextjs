'use client';
import React, { useCallback, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useSelectedLayoutSegment,
  useRouter,
} from 'next/navigation';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import { NAV_CONFIG, NavItem } from '~/constants/nav';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { api } from '~/services/trpc/react';
import { useLayoutStore } from '~/services/store/useLayoutStore';

export default function MainNav() {
  return (
    <>
      <MainNav.Logo />
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
    case 'home': {
      return <MainNav.Home item={item} />;
    }
    case 'thread': {
      return <MainNav.Thread item={item} />;
    }
    case 'link': {
      return <MainNav.Link item={item} />;
    }
    case 'myPage': {
      return <MainNav.MyPage item={item} />;
    }
    default: {
      return null;
    }
  }
};

MainNav.Home = function Item({ item }: ItemProps) {
  const pathname = usePathname();

  const relationHrefs = item.relationHrefs ?? [];
  const relationIcons = item.relationIcons ?? [];

  const href =
    relationHrefs.find((href) => href === pathname) ?? PAGE_ENDPOINTS.ROOT;
  const Icon =
    href === PAGE_ENDPOINTS.FOLLOWING ? relationIcons.at(1) : item.icon;
  const isActive = relationHrefs.includes(pathname);

  return (
    <Link
      href={item.disabled ? '#' : href}
      scroll={true}
      replace={false}
      className={cn(
        'px-8 py-5 mx-[2px] my-1 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
        isActive ? 'text-foreground' : 'text-foreground/60',
        item.disabled && 'cursor-not-allowed opacity-80',
      )}
    >
      {Icon ? <Icon /> : <item.icon />}
    </Link>
  );
};

MainNav.Link = function Item({ item }: ItemProps) {
  const pathname = usePathname();
  const href = item.href as string;

  const isActive = pathname === href ? true : false;

  return (
    <Link
      href={item.disabled ? '#' : href}
      scroll={item.id === 'thread' ? false : true}
      replace={item.id === 'thread' ? true : false}
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

MainNav.MyPage = function Item({ item }: ItemProps) {
  const segment = useSelectedLayoutSegment();
  const { data } = api.auth.getSession.useQuery();

  const href = data ? PAGE_ENDPOINTS.MY_PAGE.ID(data.user.id) : '#';

  const isActive = segment && href.startsWith(`/${segment}`) ? true : false;

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

MainNav.Thread = function Item({ item }: ItemProps) {
  const pathname = usePathname();
  const href = item.href as string;
  const isActive = pathname === href ? true : false;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { popupOpen } = useLayoutStore();

  const onClick = useCallback(() => {
    popupOpen('THREAD');

    let type: string | undefined = undefined;
    switch (pathname) {
      case PAGE_ENDPOINTS.ROOT: {
        type = 'recommendation';
        break;
      }
      case PAGE_ENDPOINTS.FOLLOWING: {
        type = 'following';
        break;
      }
      default: {
        type = undefined;
        break;
      }
    }

    const nextPath = type ? `${href}?type=${type}` : href;

    startTransition(() => {
      router.push(nextPath);
    });
  }, [router, popupOpen, href, pathname]);

  return (
    <button
      type="button"
      role="link"
      data-href={item.disabled ? '#' : href}
      className={cn(
        'px-8 py-5 mx-[2px] my-1 flex items-center text-lg font-medium transition-colors hover:bg-foreground/5 hover:rounded-md sm:text-sm',
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
};

MainNav.Menu = function Item() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const onClick = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

  const onMoveSaved = useCallback(() => {
    router.push(PAGE_ENDPOINTS.SAVED);
  }, [router]);

  const onMoveLiked = useCallback(() => {
    router.push(PAGE_ENDPOINTS.LIKED);
  }, [router]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'hover:text-foreground leading-tight',
          open ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        <Icons.alignLeft />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={20}>
        <DropdownMenuItem onClick={onClick} className="space-x-4">
          {theme === 'dark' ? <Icons.sun /> : <Icons.moon />}
          <span>
            {theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onMoveSaved}>설정</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onMoveSaved}>저장됨</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onMoveLiked}>좋아요</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

MainNav.Logo = function Item() {
  return (
    <Link href={PAGE_ENDPOINTS.ROOT} className="items-center space-x-2 md:flex">
      <Icons.threadsWhite className="hidden size-8 dark:block" />
      <Icons.threads className="block size-8 dark:hidden" />
    </Link>
  );
};
