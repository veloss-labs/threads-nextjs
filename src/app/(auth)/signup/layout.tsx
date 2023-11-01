import Link from 'next/link';
import React from 'react';
import { Icons } from '~/components/icons';
import { buttonVariants } from '~/components/ui/button';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { cn } from '~/utils/utils';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href={PAGE_ENDPOINTS.AUTH.SIGNIN}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        로그인
      </Link>
      <div className={cn('hidden h-full bg-muted lg:block')} />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.threads className="mx-auto h-8 w-8" />
          </div>
          {children}
          <p
            className={cn(
              'px-8 text-center text-sm text-muted-foreground space-x-3',
            )}
          >
            <Link
              href="/terms"
              className={cn('hover:text-brand underline underline-offset-4')}
            >
              Threads 약관
            </Link>
            <Link
              href="/privacy"
              className={cn('hover:text-brand underline underline-offset-4')}
            >
              개인정보처리방침
            </Link>
            <Link
              href="/cookie"
              className={cn('hover:text-brand underline underline-offset-4')}
            >
              쿠키정책
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
