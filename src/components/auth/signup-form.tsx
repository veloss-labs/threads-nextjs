'use client';
import React, { useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  signUpSchema,
  type SignUpInputSchema,
} from '~/services/users/users.input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { InputPassword } from '~/components/ui/input-password';
import {
  signUpAction,
  type PreviousState,
} from '~/services/users/users.action';
import { isBoolean, isUndefined } from '~/utils/assertion';

export default function SignupForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useFormState<PreviousState, SignUpInputSchema>(
    signUpAction,
    undefined,
  );

  const form = useForm<SignUpInputSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    errors: isUndefined(state) || isBoolean(state) ? undefined : state,
    reValidateMode: 'onBlur',
  });

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form
          id="signup-form"
          onSubmit={form.handleSubmit((input) => {
            startTransition(() => {
              formAction(input);
            });
          })}
        >
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="아이디"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <InputPassword
                      placeholder="비밀번호"
                      autoComplete="current-password"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <InputPassword
                      placeholder="비밀번호 확인"
                      autoComplete="current-password"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              회원가입
            </Button>
          </div>
        </form>
      </Form>
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
