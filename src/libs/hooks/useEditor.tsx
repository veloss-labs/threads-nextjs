import { useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

import type { EditorOptions } from '@tiptap/react';

export interface TiptapEditorHookParams
  extends Partial<Omit<EditorOptions, 'extensions'>> {
  placeholder?: string;
}

export type TiptapEditorInstance = NonNullable<ReturnType<typeof useEditor>>;

export function useTiptapEditor({
  placeholder,
  ...otherProps
}: TiptapEditorHookParams) {
  return useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    ...otherProps,
  });
}
