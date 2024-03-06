import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  type InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { useState } from 'react';

// import ExampleTheme from './ExampleTheme';
// import ToolbarPlugin from './plugins/ToolbarPlugin';
// import TreeViewPlugin from './plugins/TreeViewPlugin';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-0">
      <span className=" relative block min-w-0 max-w-full overflow-visible whitespace-pre-line break-words text-left text-slate-500 dark:placeholder:text-slate-400">
        스레드를 시작하세요...
      </span>
    </div>
  );
}

export default function LexicalEditor() {
  const [editorConfig, setEditorConfig] = useState<InitialConfigType>({
    namespace: 'ThreadEditor',
    nodes: [],
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
        </div>
      </div>
    </LexicalComposer>
  );
}
