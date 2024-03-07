import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  type InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Klass, LexicalNode } from 'lexical';
import React, { useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import MentionsPlugin from '~/components/editor/plugins/mentions-plugin';
import MentionNode from '~/components/editor/nodes/mention-node';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-0">
      <span className=" relative block min-w-0 max-w-full overflow-visible whitespace-pre-line break-words text-left text-slate-500 dark:placeholder:text-slate-400">
        스레드를 시작하세요...
      </span>
    </div>
  );
}

const EditorNodes: Array<Klass<LexicalNode>> = [MentionNode];

export default function LexicalEditor() {
  const [editorConfig, setEditorConfig] = useState<InitialConfigType>({
    namespace: 'ThreadEditor',
    nodes: [...EditorNodes],
    onError(error: Error) {
      throw error;
    },
    theme: {
      paragraph: 'm-0',
      text: {
        base: 'text-base text-slate-900 dark:text-slate-100',
      },
    },
  });

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="col-start-2 row-start-2 row-end-2">
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative overflow-auto outline-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MentionsPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

LexicalEditor.Skeleton = function LexicalEditorSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[450px]" />
      <Skeleton className="h-4 w-[350px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[550px]" />
      <Skeleton className="h-4 w-[500px]" />
    </div>
  );
};
