import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import ButtonSignout from './button-signout';
import { Button } from '~/components/ui/button';

export default function ButtonHeaderMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const onChaneTheme = useCallback(() => {
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
        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start space-x-2 p-0"
            variant="ghost"
            onClick={onChaneTheme}
            size="sm"
          >
            {theme === 'dark' ? <Icons.sun /> : <Icons.moon />}
            <span>
              {theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            </span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start p-0"
            variant="ghost"
            onClick={onMoveLiked}
            size="sm"
          >
            설정
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start p-0"
            variant="ghost"
            onClick={onMoveSaved}
            size="sm"
          >
            저장됨
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start p-0"
            variant="ghost"
            onClick={onMoveLiked}
            size="sm"
          >
            좋아요
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ButtonSignout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
