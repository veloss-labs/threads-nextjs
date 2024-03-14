'use client';
import React, { useCallback, useTransition } from 'react';
import Avatars from '~/components/shared/avatars';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, get, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import LexicalEditor from '~/components/editor/lexical-editor';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { cn, getFindByLexicalNodeTypes } from '~/utils/utils';
import { api } from '~/services/trpc/react';
import {
  CreateInputSchema,
  createInputSchema,
} from '~/services/threads/threads.input';
import ClientOnly from '~/components/shared/client-only';
import useBeforeUnload from '~/libs/hooks/useBeforeUnload';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  type SerializedEditorState,
  type SerializedLexicalNode,
  type EditorState,
  type LexicalEditor as ReactLexicalEditor,
} from 'lexical';
import { isEmpty } from '~/utils/assertion';
import type { ThreadListQuerySchema } from '~/services/threads/threads.query';

interface ThreadsFormProps {
  type?: ThreadListQuerySchema['type'];
  isDialog?: boolean;
  onSuccess?: () => void;
}

export default function ThreadsForm({
  isDialog,
  onSuccess,
  type,
}: ThreadsFormProps) {
  const { data: session } = api.auth.getRequireSession.useQuery();
  const utils = api.useUtils();

  const [, startTransition] = useTransition();

  const mutation = api.threads.create.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getItems.invalidate(),
        utils.threads.getRecommendations.invalidate(),
      ]);
      onSuccess?.();
    },
  });

  const form = useForm<CreateInputSchema>({
    resolver: zodResolver(createInputSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (values: CreateInputSchema) => {
    const htmlJSON: SerializedEditorState<SerializedLexicalNode> | null =
      values.htmlJSON ? JSON.parse(values.htmlJSON) : null;

    let mentions: string[] | undefined = undefined;
    let hashTags: string[] | undefined = undefined;
    if (htmlJSON) {
      const findNodes = getFindByLexicalNodeTypes(
        ['mention', 'hashtag'],
        htmlJSON,
      );

      const tempMentions = findNodes.filter((node) => node.type === 'mention');
      const tempHashtags = findNodes.filter((node) => node.type === 'hashtag');

      if (!isEmpty(tempHashtags)) {
        hashTags = tempHashtags.map((node) => node.node.text);
      }

      if (!isEmpty(tempMentions)) {
        mentions = tempMentions.map((node) => node.node.text);
      }
    }

    mutation.mutate({
      ...values,
      mentions,
      hashTags,
    });
  };

  const {
    watch,
    formState: { errors },
  } = form;

  const watchText = watch('text');

  const onEditorUpdate = useCallback(
    (
      editorState: EditorState,
      editor: ReactLexicalEditor,
      onUpdate: (...event: any[]) => void,
    ) => {
      editor.update(() => {
        if (editorState.isEmpty()) {
          onUpdate('');
          return;
        }
        const htmlString = $generateHtmlFromNodes(editor, null);
        onUpdate(htmlString);
      });

      startTransition(() => {
        const htmlJSON = JSON.stringify(editorState);
        console.log('htmlJSON', htmlJSON);
        form.setValue('htmlJSON', editorState.isEmpty() ? undefined : htmlJSON);
      });
    },
    [form],
  );

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
                render={({ field }) => {
                  field.onChange;
                  return (
                    <FormItem>
                      <FormControl>
                        <ClientOnly fallback={<LexicalEditor.Skeleton />}>
                          <LexicalEditor
                            editable={!field.disabled}
                            onChange={(editorState, editor) =>
                              onEditorUpdate(
                                editorState,
                                editor,
                                field.onChange,
                              )
                            }
                            onBlur={(editorState, editor) =>
                              onEditorUpdate(editorState, editor, field.onBlur)
                            }
                          />
                        </ClientOnly>
                      </FormControl>
                      <ThreadsForm.EditorMessage
                        errors={errors}
                        id={field.name}
                      />
                    </FormItem>
                  );
                }}
              />
            </div>
          </form>
        </Form>
      </div>
      {watchText && watchText.length > 0 ? <ThreadsForm.BeforeUnload /> : null}
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

ThreadsForm.BeforeUnload = function Item() {
  useBeforeUnload(
    (evt) => {
      const returnValue =
        '화면을 벗어나면 작업이 취소됩니다. 화면을 벗어나시겠습니까?';

      evt.preventDefault();
      evt.returnValue = returnValue;

      return returnValue;
    },
    {
      capture: true,
    },
  );

  return null;
};
