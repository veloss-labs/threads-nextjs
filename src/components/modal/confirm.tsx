'use client';
import React from 'react';
import {
  unmount as reactUnmount,
  render as reactRender,
} from '~/libs/react/render';
import type { ModalFuncProps, ConfigUpdate } from './types';
import destroyFns from './destoryFns';
import { ModalContextProvider } from './context';
import ConfirmModal, { type ConfirmModalProps } from './confirm-modal';

function ConfirmDialogWrapper(props: ConfirmModalProps) {
  const { getContainer } = props;
  console.log(getContainer);
  return (
    <ModalContextProvider {...props}>
      <ConfirmModal {...props} />
    </ModalContextProvider>
  );
}

export default function confirm(config: ModalFuncProps) {
  const container = document.createDocumentFragment();
  let currentConfig = { ...config, close, open: true } as ModalFuncProps;
  let timeoutId: ReturnType<typeof setTimeout>;

  function destroy(...args: any[]) {
    const triggerCancel = args.some((param) => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(() => {}, ...args.slice(1));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns.at(i);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }

    reactUnmount(container);
  }

  function render(props: any) {
    clearTimeout(timeoutId);

    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    timeoutId = setTimeout(() => {
      const dom = <ConfirmDialogWrapper {...props} />;

      reactRender(dom, container);
    });
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }

        // @ts-expect-error - apply arguments to destroy function
        destroy.apply(this, args);
      },
    };

    render(currentConfig);
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy,
    update,
  };
}

export function withSuccess(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'success',
  };
}
