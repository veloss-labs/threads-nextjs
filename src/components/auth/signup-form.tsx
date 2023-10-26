'use client';
import React, { useCallback } from 'react';
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

import { createUser } from '~/server/actions/users';
import { useFormState, useFormStatus } from '~/libs/react/form';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

type FormFields = z.infer<typeof formSchema>;

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export default function SignupForm() {
  const initialState: Result = {
    resultCode: -1,
    resultMessage: null,
  };

  const [state, formAction] = useFormState<Result, FormFields>(
    createUser,
    initialState,
  );

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    (values: FormFields) => {
      formAction(values);
    },
    [formAction],
  );

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="username"
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
                      placeholder="password"
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
            <SignupForm.SubmitButton />
          </div>
        </form>
      </Form>
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
    </div>
  );
}

SignupForm.SubmitButton = function Item() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Submit
    </Button>
  );
};
