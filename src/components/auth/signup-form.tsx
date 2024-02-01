'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { createUserWithRevalidateAction } from '~/server/actions/users/users';
import { RESULT_CODE } from '~/constants/constants';
import { useFormState, useFormStatus } from '~/libs/react/form';
import { cn } from '~/utils/utils';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

type FormFields = z.infer<typeof formSchema>;

type FormState = {
  resultCode: number;
  resultMessage: string | null;
};

const initialFormState: FormState = {
  resultCode: RESULT_CODE.OK,
  resultMessage: null,
};

export default function SignupForm() {
  const [state, formAction] = useFormState<FormState, FormFields>(
    createUserWithRevalidateAction,
    initialFormState,
  );

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formAction)}>
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="사용자 이름"
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
                  <FormControl>
                    <Input
                      type="password"
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
            {state?.resultMessage && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {state?.resultMessage}
              </p>
            )}
            <SignupForm.Submit />
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

SignupForm.Submit = function Item() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      회원가입
    </Button>
  );
};
