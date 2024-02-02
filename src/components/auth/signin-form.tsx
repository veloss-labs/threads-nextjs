'use client';
import React, { useCallback, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getTargetElement } from '~/libs/browser/dom';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import { signinAction } from '~/services/users/users.action';

export default function SignInForm() {
  const [state, formAction] = useFormState(signinAction, null);

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <div className="grid gap-5">
          <div className="space-y-2">
            <Input
              type="text"
              name="username"
              placeholder="사용자 이름"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              dir="ltr"
            />
            {state?.errors?.fieldErrors?.username && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {state?.errors?.fieldErrors?.username?.at(0)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              dir="ltr"
            />
            {state?.errors?.fieldErrors?.password && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {state?.errors?.fieldErrors?.password?.at(0)}
              </p>
            )}
          </div>
          <SubmitButton />
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={cn('bg-background px-2 text-muted-foreground')}>
            또는
          </span>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  const $div = useRef<HTMLDivElement>(null);

  const onClick = useCallback(() => {
    const $ele = getTargetElement($div);
    if (!$ele) {
      return;
    }

    const $form = $ele.closest('form');
    if (!$form) {
      return;
    }

    $form.requestSubmit();
  }, []);

  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      로그인
    </Button>
  );
}
