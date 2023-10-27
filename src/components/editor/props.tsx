import { EditorProps } from '@tiptap/pm/view';
import { cn } from '~/utils/utils';

export function TiptapEditorProps(
  setIsSubmitting?: (
    isSubmitting: 'submitting' | 'submitted' | 'saved',
  ) => void,
  className?: any,
): EditorProps {
  return {
    attributes: {
      class: cn(
        `prose prose-brand max-w-full prose-headings:font-display font-default focus:outline-none`,
        className,
      ),
    },
  };
}
