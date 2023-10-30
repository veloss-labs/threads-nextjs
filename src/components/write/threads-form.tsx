'use client';
import React, { useTransition } from 'react';
import * as z from 'zod';
import Avatars from '~/components/shared/avatars';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, get, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { TipTapEditor } from '~/components/editor/tiptap-editor';
import { useSession } from 'next-auth/react';
import {
  createThreadsWithRedirect,
  createThreads,
} from '~/server/actions/threads';
import { Icons } from '../icons';
import { cn } from '~/utils/utils';
import { useFormState, useFormStatus } from '~/libs/react/form';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

type FormFields = z.infer<typeof formSchema>;

interface ThreadsFormProps {
  isDialog?: boolean;
}

type FormState = {
  resultCode: number;
  resultMessage: string | null;
};

const initialFormState: FormState = {
  resultCode: RESULT_CODE.OK,
  resultMessage: null,
};

export default function ThreadsForm({ isDialog }: ThreadsFormProps) {
  const { data } = useSession();

  const router = useRouter();

  const [state, formAction] = useFormState<FormState, FormFields>(
    createThreadsWithRedirect,
    initialFormState,
  );

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: FormFields) => {
    if (isDialog) {
      /**
       * intercepting route server action 리다이렉트시 에러가 발생하는 이슈가 있어서
       * 클라이언트 사이드에서 리다이렉트를 처리하도록 수정
       * @sse https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
       * @sse https://medium.com/@rezahedi/next-js-issue-of-redirect-in-server-actions-with-unmounting-intercepting-route-or-modal-from-the-ui-62b7a9702b7f
       */
      startTransition(async () => {
        await createThreads(values);
        router.replace(PAGE_ENDPOINTS.ROOT);
      });
      return;
    }
    formAction(values);
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
          <ThreadsForm.Submit isDialog={!!isDialog} isPending={isPending} />
        </div>
      </div>

      <ThreadsForm.EditorMessage errors={errors} id="text" />
      <ThreadsForm.ServerMessage error={state?.resultMessage ?? null} />

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
                        className={cn(
                          'prose prose-brand prose-headings:font-display font-default focus:outline-none',
                        )}
                        customClassName={cn(
                          isDialog ? 'max-w-[462px] p-0' : 'p-0',
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

interface SubmitProps {
  isPending: boolean;
  isDialog: boolean;
}

ThreadsForm.Submit = function Item({ isDialog, isPending }: SubmitProps) {
  const { pending } = useFormStatus();

  const loading = isDialog ? isPending : pending;

  return (
    <Button
      form="threads-form"
      type="submit"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
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
