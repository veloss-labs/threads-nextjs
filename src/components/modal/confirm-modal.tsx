'use client';
import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import type { ModalFuncProps } from './types';
import { Button, type ButtonProps } from '../ui/button';
import { cn } from '~/utils/utils';

interface ConfirmOkButtonProps extends ButtonProps {
  text?: React.ReactNode;
}

function ConfirmOkButton({ text, ...otherProps }: ConfirmOkButtonProps) {
  return (
    <Button variant="default" {...otherProps}>
      {text ?? '확인'}
    </Button>
  );
}

interface ConfirmCancelButtonProps extends ButtonProps {
  text?: React.ReactNode;
}

function ConfirmCancelButton({
  text,
  ...otherProps
}: ConfirmCancelButtonProps) {
  return (
    <Button variant="destructive" {...otherProps}>
      {text ?? '취소'}
    </Button>
  );
}

export interface ConfirmModalProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  onConfirm?: (confirmed: boolean) => void;
}

export default function ConfirmModal({
  open,
  afterClose,
  getContainer,
  onConfirm,
  close,
  // header
  title,
  titleClassName,
  description,
  descriptionClassName,
  // content
  content,
  contentClassName,
  // footer
  footer,
  footerClassName,
  // button
  okButtonProps,
  okText,
  cancelButtonProps,
  cancelText,
}: ConfirmModalProps) {
  const onModalClose = useCallback(() => {
    afterClose?.();

    close?.({ triggerCancel: true });

    onConfirm?.(false);
  }, [afterClose, close, onConfirm]);

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        onModalClose();
      }
    },
    [onModalClose],
  );

  const titleComponent = (
    <DialogHeader>
      {title && (
        <DialogTitle className={cn(titleClassName)}>{title}</DialogTitle>
      )}
      {description && (
        <DialogDescription className={cn(descriptionClassName)}>
          {description}
        </DialogDescription>
      )}
    </DialogHeader>
  );

  const footerOriginNode = (
    <DialogFooter className={cn(footerClassName)}>
      <ConfirmCancelButton {...cancelButtonProps} text={cancelText} />
      <ConfirmOkButton {...okButtonProps} text={okText} />
    </DialogFooter>
  );

  const footerComponent =
    typeof footer === 'function'
      ? footer(footerOriginNode, {
          OkBtn: ConfirmOkButton,
          CancelBtn: ConfirmCancelButton,
        })
      : footerOriginNode;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(contentClassName)}>
        {titleComponent}
        {content}
        {footerComponent}
      </DialogContent>
    </Dialog>
  );
}
