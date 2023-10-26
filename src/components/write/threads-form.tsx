'use client';
import React, { useCallback } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, get, useForm } from 'react-hook-form';
import { Form, FormMessage } from '~/components/ui/form';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '~/components/ui/button';
import { TipTapEditor } from '~/components/editor/tiptap-editor';
import { useSession } from 'next-auth/react';
import Avatars from '~/components/shared/avatars';
import { useFormState, useFormStatus } from '~/libs/react/form';
import { createThreads } from '~/server/actions/threads';
import { Icons } from '../icons';
import { cn } from '~/utils/utils';

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

type FormFields = z.infer<typeof formSchema>;

export default function ThreadsForm() {
  const { data } = useSession();

  const initialState: Result = {
    resultCode: -1,
    resultMessage: null,
  };

  const [state, formAction] = useFormState<Result | undefined, FormFields>(
    createThreads,
    initialState,
  );

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = useCallback(
    (values: FormFields) => {
      console.log('values', values);
      formAction(values);
    },
    [formAction],
  );

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
          <ThreadsForm.SubmitButton />
        </div>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form id="threads-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <TipTapEditor
                editable={true}
                value={form.watch('text')}
                debouncedUpdatesEnabled={true}
                onChange={(description: Object, description_html: string) => {
                  form.setValue('text', description_html);
                }}
              />
            </div>
            <ThreadsForm.EditorMessage errors={errors} id="text" />
          </form>
        </Form>
      </div>
    </>
  );
}

ThreadsForm.SubmitButton = function Item() {
  const { pending } = useFormStatus();
  return (
    <Button
      form="threads-form"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      게시
    </Button>
  );
};

interface EditorMessageProps {
  errors: FieldErrors<FormFields>;
  id: FieldPath<FormFields>;
}

ThreadsForm.EditorMessage = function Item({ errors, id }: EditorMessageProps) {
  const error = get(errors, id);

  const body = error ? String(error?.message) : null;

  console.log('body', body);

  if (!body) {
    return null;
  }

  console.log('body', body);

  return (
    <p className={cn('text-sm font-medium text-red-500 dark:text-red-900')}>
      {body}
    </p>
  );
};
