import { create } from 'zustand';

type PopupType = 'NOOP' | 'THREAD' | 'WHO_CAN_LEAVE_REPLY' | 'SEARCH_PAGE';

type MetaData = {
  [key: string]: any;
};

interface PopupState {
  type: PopupType;
  open: boolean;
  meta?: MetaData;
}

interface LayoutStore {
  popup: PopupState;
  cleanUp: () => void;
  popupOpen(popupType: PopupType, meta?: MetaData): void;
  popupClose: () => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  popup: {
    type: 'NOOP',
    open: false,
    meta: undefined,
  },
  cleanUp() {
    set(() => ({
      popup: {
        type: 'NOOP',
        open: false,
        meta: undefined,
      },
    }));
  },
  popupOpen(popupType: PopupType, meta?: MetaData) {
    set((prev) => ({
      ...prev,
      popup: {
        ...prev.popup,
        type: popupType,
        open: true,
        meta,
      },
    }));
  },
  popupClose() {
    set((prev) => ({
      ...prev,
      popup: {
        ...prev.popup,
        type: 'NOOP',
        open: false,
        meta: undefined,
      },
    }));
  },
}));
