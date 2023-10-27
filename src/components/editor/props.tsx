import { EditorProps } from '@tiptap/pm/view';
import { cn } from '~/utils/utils';

export function TiptapEditorProps(
  setIsSubmitting?: (
    isSubmitting: 'submitting' | 'submitted' | 'saved',
  ) => void,
  className?: string,
): EditorProps {
  return {
    attributes: {
      class: className ?? '',
    },
  };
}
