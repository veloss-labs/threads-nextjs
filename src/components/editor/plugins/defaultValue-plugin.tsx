import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, type LexicalEditor } from 'lexical';
import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from '~/libs/browser/dom';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

interface LexicalDefaultValuePluginProps {
  initialValue?: string;
}

export default function LexicalDefaultValuePlugin({
  initialValue,
}: LexicalDefaultValuePluginProps) {
  const [editor] = useLexicalComposerContext();

  const updateHTML = (editor: LexicalEditor, value: string, clear: boolean) => {
    const root = $getRoot();
    const parser = new DOMParser();
    const dom = parser.parseFromString(value, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    if (clear) {
      root.clear();
    }
    root.append(...nodes);
  };

  useIsomorphicLayoutEffect(() => {
    if (editor && initialValue) {
      editor.update(() => {
        updateHTML(editor, initialValue, true);
      });
    }
  }, [initialValue]);

  return null;
}
