'use client';
import React, { useCallback } from 'react';
import Avatars from '~/components/shared/avatars';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, get, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import LexicalEditor from '~/components/editor/lexical-editor';
import { Button } from '~/components/ui/button';
import { useSession } from 'next-auth/react';
import { Icons } from '~/components/icons';
import { cn } from '~/utils/utils';
import { api } from '~/services/trpc/react';
import {
  CreateInputSchema,
  createInputSchema,
} from '~/services/threads/threads.input';

interface ThreadsFormProps {
  isDialog?: boolean;
  onSuccess?: () => void;
}

export default function ThreadsForm({ isDialog, onSuccess }: ThreadsFormProps) {
  const { data: session } = useSession();

  const mutation = api.threads.create.useMutation({
    async onSuccess(data) {
      if (data.data) {
        await utils.threads.getThreads.invalidate();
      }
      onSuccess?.();
    },
  });
  const utils = api.useUtils();

  const form = useForm<CreateInputSchema>({
    resolver: zodResolver(createInputSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (values: CreateInputSchema) => {
    mutation.mutate(values);
  };

  const {
    formState: { errors },
  } = form;

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatars src={undefined} fallback={'T'} alt="thumbnail" />
        <div>
          <p className="text-sm font-medium leading-none">
            {session?.user?.username}
          </p>
        </div>
        <div className="flex w-full justify-end">
          <Button
            form="threads-form"
            type="submit"
            disabled={mutation.isPending}
            aria-disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            게시
          </Button>
        </div>
      </div>

      <div className={cn('grid gap-6', isDialog ? undefined : 'my-4')}>
        <Form {...form}>
          <form id="threads-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoCapitalize="none"
                        autoCorrect="off"
                        placeholder="스레드를 시작하세요..."
                        {...field}
                      /> */}
                      <LexicalEditor />
                    </FormControl>
                    <ThreadsForm.EditorMessage
                      errors={errors}
                      id={field.name}
                    />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

interface EditorMessageProps {
  errors: FieldErrors<CreateInputSchema>;
  id: FieldPath<CreateInputSchema>;
  remoteError?: string | null;
}

ThreadsForm.EditorMessage = function Item({
  errors,
  id,
  remoteError,
}: EditorMessageProps) {
  const errorMsgFn = useCallback((text: string) => {
    return (
      <p className={cn('text-sm font-medium text-red-500 dark:text-red-900')}>
        {text}
      </p>
    );
  }, []);

  if (remoteError) {
    return errorMsgFn(remoteError);
  }

  const error = get(errors, id);

  const body = error ? String(error?.message) : null;

  if (!body) {
    return null;
  }

  return errorMsgFn(body);
};
