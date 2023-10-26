import { EditorProps } from '@tiptap/pm/view';

export function TiptapEditorProps(
  setIsSubmitting?: (
    isSubmitting: 'submitting' | 'submitted' | 'saved',
  ) => void,
): EditorProps {
  return {
    attributes: {
      class: `prose prose-brand max-w-full prose-headings:font-display font-default focus:outline-none`,
    },
  };
}
