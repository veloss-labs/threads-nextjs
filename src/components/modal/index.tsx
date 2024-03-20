import OriginModal from './confirm-modal';
import confirm, { withModal } from './confirm';
import type { ModalFuncProps, ModalStaticFunctions } from './types';

type ModalType = typeof OriginModal &
  ModalStaticFunctions & {
    // useModal: typeof useModal;
    destroyAll: () => void;
  };

const Modal = OriginModal as ModalType;

Modal.confirm = function confirmFn(props: ModalFuncProps) {
  return confirm(withModal(props));
};

export default Modal;
