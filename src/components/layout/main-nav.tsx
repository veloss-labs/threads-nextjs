'use client';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
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

MainNav.Menu = function Item() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const onClick = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

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
        <DropdownMenuItem onClick={onClick}>모드전환</DropdownMenuItem>
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
