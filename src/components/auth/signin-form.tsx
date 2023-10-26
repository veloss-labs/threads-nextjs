'use client';
import React, { useCallback, useState, useTransition } from 'react';
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
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

type FormFields = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (values: FormFields) => {
      setLoading(true);
      try {
        const resp = await signIn('credentials', {
          ...values,
          redirect: false,
        });

        if (resp) {
          if (!resp.error && resp?.ok) {
            router.replace(PAGE_ENDPOINTS.ROOT);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [router],
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
            <Button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
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
