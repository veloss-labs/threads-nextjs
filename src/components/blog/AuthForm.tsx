'use client';
import React, { useCallback, useState, useTransition } from 'react';
import classNames from 'classnames';
import { buttonVariants } from '~/components/blog/ui/Button';
import { Icons } from '~/components/blog/Icons';
import { Label } from '~/components/blog/ui/Label';
import { Input } from '~/components/blog/ui/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';

interface AuthFormProps {
  type: 'signin' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onGithubSignin = useCallback(async () => {
    setIsGitHubLoading(true);

    await signIn('github');

    startTransition(() => {
      router.push(PAGE_ENDPOINTS.ROOT);
    });
  }, [router]);

  return (
    <div className="grid gap-6">
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isGitHubLoading}
              // disabled={isLoading || isGitHubLoading}
              // {...register('email')}
            />
            {/* {errors?.email && (
          <p className="px-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )} */}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isGitHubLoading}
              // disabled={isLoading || isGitHubLoading}
              // {...register('email')}
            />
            {/* {errors?.email && (
          <p className="px-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )} */}
          </div>
          <button
            className={classNames(buttonVariants())}
            // disabled={isLoading}
          >
            {/* {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )} */}
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={classNames(buttonVariants({ variant: 'outline' }))}
        onClick={onGithubSignin || isPending}
        disabled={isGitHubLoading}
        // disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading || isPending ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
      </button>
    </div>
  );
}
