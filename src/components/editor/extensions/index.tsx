import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

import 'highlight.js/styles/github-dark.css';

export const TiptapExtensions = (
  setIsSubmitting?: (
    isSubmitting: 'submitting' | 'submitted' | 'saved',
  ) => void,
) => [
  Placeholder.configure({
    emptyEditorClass: 'is-editor-empty',
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }

      if (node.type.name === 'image' || node.type.name === 'table') {
        return '';
      }

      return '스레드를 시작하세요...';
    },
    includeChildren: true,
  }),
  CharacterCount.configure({
    limit: 500,
    mode: 'nodeSize',
  }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3 -mt-2',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3 -mt-2',
      },
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal -mb-2',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-custom-border-300',
      },
    },
    code: {
      HTMLAttributes: {
        class:
          'rounded-md bg-custom-primary-30 mx-1 px-1 py-1 font-mono font-medium text-custom-text-1000',
        spellcheck: 'false',
      },
    },
    codeBlock: false,
    horizontalRule: false,
    dropcursor: {
      color: 'rgba(var(--color-text-100))',
      width: 2,
    },
    gapcursor: false,
  }),
];
