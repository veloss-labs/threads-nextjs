import OriginModal from './confirm-modal';
import confirm, { withSuccess } from './confirm';
import type { ModalFuncProps, ModalStaticFunctions } from './types';

type ModalType = typeof OriginModal &
  ModalStaticFunctions & {
    // useModal: typeof useModal;
    destroyAll: () => void;
  };

const Modal = OriginModal as ModalType;

Modal.success = function successFn(props: ModalFuncProps) {
  return confirm(withSuccess(props));
};

export default Modal;
