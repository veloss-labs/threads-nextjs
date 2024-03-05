'use client';
import React, { useCallback, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import { getTargetElement } from '~/libs/browser/dom';
import { signupAction } from '~/services/users/users.action';
import { STATUS_CODE } from '~/constants/constants';

export default function SignupForm() {
  const [state, formAction] = useFormState(signupAction, null);

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
          {state?.resultCode === STATUS_CODE.SERVER_ERROR ? (
            <p className="text-sm font-medium text-red-500 dark:text-red-900">
              회원가입에 실패했습니다. 다시 시도해주세요.
            </p>
          ) : null}
          {state?.resultCode === STATUS_CODE.UNAUTHORIZED ? (
            <p className="text-sm font-medium text-red-500 dark:text-red-900">
              인증에 실패했습니다. 다시 시도해주세요.
            </p>
          ) : null}
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
      회원가입
    </Button>
  );
}
