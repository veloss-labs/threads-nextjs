import React, { useRef, useState } from 'react';
import { Button, type ButtonProps } from '~/components/ui/button';

export interface ActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  actionFn?: (...args: any[]) => any | PromiseLike<any>;
  close?: Function;
  emitEvent?: boolean;
  quitOnNullishReturnValue?: boolean;
  isSilent?: () => boolean;
}

function isThenable<T extends any>(thing?: PromiseLike<T>): boolean {
  return !!(thing && thing.then);
}

export default function ActionButton({
  close,
  actionFn,
  emitEvent,
  children,
  quitOnNullishReturnValue,
  isSilent,
  ...buttonProps
}: ActionButtonProps) {
  const clickedRef = useRef<boolean>(false);

  const onInternalClose = (...args: any[]) => {
    close?.(...args);
  };

  const handlePromiseOnConfirm = (returnValueOfOnOk?: PromiseLike<any>) => {
    if (!isThenable(returnValueOfOnOk)) {
      return;
    }

    returnValueOfOnOk?.then(
      (...args: any[]) => {
        onInternalClose(...args);
        clickedRef.current = false;
      },
      (e: Error) => {
        clickedRef.current = false;

        if (isSilent?.()) {
          return;
        }

        return Promise.reject(e);
      },
    );
  };

  const onClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (clickedRef.current) {
      return;
    }
    clickedRef.current = true;
    if (!actionFn) {
      onInternalClose();
      return;
    }
    let returnValueOfOnOk: PromiseLike<any>;
    if (emitEvent) {
      returnValueOfOnOk = actionFn(e);
      if (quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
        clickedRef.current = false;
        onInternalClose(e);
        return;
      }
    } else if (actionFn.length) {
      returnValueOfOnOk = actionFn(close);
      // https://github.com/ant-design/ant-design/issues/23358
      clickedRef.current = false;
    } else {
      returnValueOfOnOk = actionFn();
      if (!returnValueOfOnOk) {
        onInternalClose();
        return;
      }
    }
    handlePromiseOnConfirm(returnValueOfOnOk);
  };

  return (
    <Button onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
}
