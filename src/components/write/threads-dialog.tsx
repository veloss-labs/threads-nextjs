import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import ThreadsForm from '~/components/write/threads-form';
import { LexicalEditorProps } from '~/components/editor/lexical-editor';

interface ThreadsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  quotation?: Record<string, string> | undefined;
  editorState?: LexicalEditorProps['editorState'];
}

export default function ThreadsDialog({
  open,
  onClose,
  onSuccess,
  editorState,
  quotation,
}: ThreadsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>새로운 스레드</DialogTitle>
        </DialogHeader>
        <ThreadsForm
          isDialog
          onSuccess={onSuccess}
          editorState={editorState}
          quotation={quotation}
        />
      </DialogContent>
    </Dialog>
  );
}
