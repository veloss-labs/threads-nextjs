import { type ClassValue } from 'clsx';
import type { ButtonProps } from '~/components/ui/button';

export type ModalFooterRender = (
  originNode: React.ReactNode,
  extra: { OkBtn: React.FC; CancelBtn: React.FC },
) => React.ReactNode;

interface ModalCommonProps {
  //   styles?: Omit<NonNullable<DialogProps['styles']>, 'wrapper'>;
}

export interface ModalProps extends ModalCommonProps {}

type getContainerFunc = () => HTMLElement;

export interface ModalFuncProps extends ModalCommonProps {
  open?: boolean;

  title?: React.ReactNode;
  titleClassName?: ClassValue[];

  description?: React.ReactNode;
  descriptionClassName?: ClassValue[];

  footer?: ModalFooterRender | React.ReactNode;
  footerClassName?: ClassValue[];

  content?: React.ReactNode;
  contentClassName?: ClassValue[];

  // TODO: find out exact types
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  afterClose?: () => void;

  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;

  okCancel?: boolean;
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';

  getContainer?: string | HTMLElement | getContainerFunc | false;
}

export type MousePosition = { x: number; y: number } | null;

export type ConfigUpdate =
  | ModalFuncProps
  | ((prevConfig: ModalFuncProps) => ModalFuncProps);

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
};

export type ModalStaticFunctions = Record<
  NonNullable<ModalFuncProps['type']>,
  ModalFunc
>;
