'use client';
import React, { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import type { ModalFuncProps } from './types';
import ActionButton from './action-button';
import { cn } from '~/utils/utils';
import { ModalContextProvider, useModalContext } from './context';

function ConfirmOkButton() {
  const { close, onConfirm, onOk, okButtonProps, okText, isSilent } =
    useModalContext();

  return (
    <ActionButton
      variant="default"
      {...okButtonProps}
      isSilent={isSilent}
      actionFn={onOk}
      close={(...args: any[]) => {
        close?.(...args);
        onConfirm?.(true);
      }}
    >
      {okText}
    </ActionButton>
  );
}

function ConfirmCancelButton() {
  const {
    close,
    onCancel,
    onConfirm,
    cancelButtonProps,
    cancelText,
    okCancel,
    isSilent,
  } = useModalContext();

  if (!okCancel) {
    return null;
  }

  return (
    <ActionButton
      variant="destructive"
      {...cancelButtonProps}
      isSilent={isSilent}
      actionFn={onCancel}
      close={(...args: any[]) => {
        close?.(...args);
        onConfirm?.(false);
      }}
    >
      {cancelText}
    </ActionButton>
  );
}

export interface ConfirmModalProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  onConfirm?: (confirmed: boolean) => void;
  isSilent?: () => boolean;
}

export default function ConfirmModal({
  open,
  afterClose,
  getContainer,
  onConfirm,
  close,
  onCancel,
  onOk,
  isSilent,
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
  // opts
  okCancel,
}: ConfirmModalProps) {
  const ctxValues = {
    afterClose,
    onConfirm,
    close,
    onCancel,
    onOk,
    isSilent,
    okButtonProps,
    okText,
    cancelButtonProps,
    cancelText,
    okCancel,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const btnCtxValues = useMemo(() => ctxValues, [...Object.values(ctxValues)]);

  const onClose = useCallback(() => {
    afterClose?.();

    close?.({ triggerCancel: true });

    onConfirm?.(false);
  }, [afterClose, close, onConfirm]);

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        onClose();
      }
    },
    [onClose],
  );

  const headerOriginNode = (
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
    <ModalContextProvider {...btnCtxValues}>
      <DialogFooter className={cn(footerClassName)}>
        <ConfirmCancelButton />
        <ConfirmOkButton />
      </DialogFooter>
    </ModalContextProvider>
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
        {headerOriginNode}
        {content}
        {footerComponent}
      </DialogContent>
    </Dialog>
  );
}
