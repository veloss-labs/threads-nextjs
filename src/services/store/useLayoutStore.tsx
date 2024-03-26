import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type PopupType = 'NOOP' | 'THREAD' | 'WHO_CAN_LEAVE_REPLY' | 'SEARCH_PAGE';

export type Invalidator = (() => any) | (() => Promise<any>);

export type InvalidationFunction = Invalidator | Invalidator[];

export type MetaData = {
  quotation?: any;
  invalidateFunctions?: InvalidationFunction;
  intialValue?: {
    [key: string]: any;
  };
  redirectUrl?: string;
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
  getPopupMetaData: () => MetaData | undefined;
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
  getPopupMetaData() {
    return this.popup.meta;
  },
}));

interface LayoutMetaDataSessionStoreState {
  metaData?: MetaData;
}

interface LayoutMetaDataSessionStoreActions {
  setMetaData: (value?: MetaData) => void;
  getMetaData: () => MetaData | undefined;
  clearMetaData: () => void;
}

type LayoutMetaDataSessionStore = LayoutMetaDataSessionStoreState &
  LayoutMetaDataSessionStoreActions;

export const useLayoutMetaDataSessionStore =
  create<LayoutMetaDataSessionStore>()(
    persist(
      (set, get) => ({
        metaData: undefined,
        setMetaData: (value?: MetaData) => {
          set((state) => {
            state.metaData = value;
            return state;
          });
        },
        getMetaData: () => {
          return get().metaData;
        },
        clearMetaData: () => {
          set(() => ({
            metaData: undefined,
          }));
        },
      }),
      {
        name: '@@thread:layout-session-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
