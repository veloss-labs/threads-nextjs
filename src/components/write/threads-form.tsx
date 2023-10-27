'use client';
import React, { useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, get, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { TipTapEditor } from '~/components/editor/tiptap-editor';
import { useSession } from 'next-auth/react';
import Avatars from '~/components/shared/avatars';
import { createThreads } from '~/server/actions/threads';
import { Icons } from '../icons';
import { cn } from '~/utils/utils';
import { RESULT_CODE } from '~/constants/constants';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

type FormFields = z.infer<typeof formSchema>;

interface ThreadsFormProps {
  isDialog?: boolean;
}

export default function ThreadsForm({ isDialog }: ThreadsFormProps) {
  const router = useRouter();
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (values: FormFields) => {
    setError(null);

    const action = async () => {
      const result = await createThreads(values);
      if (result.resultCode === RESULT_CODE.OK) {
        router.back();
        return;
      }

      setError(result.resultMessage);
    };

    startTransition(() => {
      action();
    });
  };

  const {
    formState: { errors },
  } = form;

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatars src={data?.user?.image} fallback={'T'} alt="thumbnail" />
        <div>
          <p className="text-sm font-medium leading-none">
            {data?.user?.username}
          </p>
        </div>
        <div className="flex w-full justify-end">
          <Button
            form="threads-form"
            type="submit"
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            게시
          </Button>
        </div>
      </div>

      <ThreadsForm.EditorMessage errors={errors} id="text" />
      <ThreadsForm.ServerMessage error={error} />

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
                      <TipTapEditor
                        ref={field.ref}
                        editable={true}
                        debouncedUpdatesEnabled={false}
                        name={field.name}
                        value={field.value}
                        noBorder
                        customClassName={cn(
                          isDialog ? 'max-w-[462px] p-0' : 'max-w-[50rem] p-0',
                        )}
                        onChange={(
                          _,
                          description_html: string,
                          empty: boolean,
                        ) => {
                          field.onChange(empty ? '' : description_html);
                        }}
                        onBlur={() => {
                          field.onBlur();
                        }}
                      />
                    </FormControl>
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
  errors: FieldErrors<FormFields>;
  id: FieldPath<FormFields>;
}

ThreadsForm.EditorMessage = function Item({ errors, id }: EditorMessageProps) {
  const error = get(errors, id);

  const body = error ? String(error?.message) : null;

  if (!body) {
    return null;
  }

  return (
    <p className={cn('text-sm font-medium text-red-500 dark:text-red-900')}>
      {body}
    </p>
  );
};

ThreadsForm.ServerMessage = function Item({ error }: { error: string | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className={cn('text-sm font-medium text-red-500 dark:text-red-900')}>
      {error}
    </p>
  );
};
