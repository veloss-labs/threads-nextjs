import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  type EditorState,
  type LexicalEditor,
} from 'lexical';
import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from '~/libs/browser/dom';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

interface LexicalOnBlurPluginProps {
  onBlur?: (
    editorState: EditorState,
    editor: LexicalEditor,
    event: FocusEvent,
  ) => void;
}

export default function LexicalOnBlurPlugin({
  onBlur,
}: LexicalOnBlurPluginProps) {
  const [editor] = useLexicalComposerContext();

  useIsomorphicLayoutEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      (payload, editor) => {
        onBlur?.(editor.getEditorState(), editor, payload);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor, onBlur]);

  return null;
}
