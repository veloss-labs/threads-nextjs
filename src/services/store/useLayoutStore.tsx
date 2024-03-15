import { create } from 'zustand';

type PopupType = 'NOOP' | 'THREAD';

interface PopupState {
  type: PopupType;
  open: boolean;
}

interface LayoutStore {
  popup: PopupState;
  cleanUp: () => void;
  popupOpen(popupType: PopupType): void;
  popupClose: () => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  popup: {
    type: 'NOOP',
    open: false,
  },
  cleanUp() {
    set(() => ({
      popup: {
        type: 'NOOP',
        open: false,
      },
    }));
  },
  popupOpen(popupType: PopupType) {
    set((prev) => ({
      ...prev,
      popup: {
        ...prev.popup,
        type: popupType,
        open: true,
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
      },
    }));
  },
}));
