import React from 'react';
import { createContext, useContext, useRef } from 'react';
import { useStore, createStore, StoreApi } from 'zustand';
import { Nullable } from '~/ts/common';

interface UserSchema extends Record<string, any> {}

export interface AuthStore {
  isLoggedIn: boolean;
  currentProfile: Nullable<UserSchema>;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setProfile: (profile: Nullable<UserSchema>) => void;
  setAuth: (isLoggedIn: boolean, profile: Nullable<UserSchema>) => void;
}

const getDefaultInitialState = () =>
  ({
    isLoggedIn: false,
    currentProfile: null,
  } as Omit<AuthStore, 'setLoggedIn'>);

const AuthContext = createContext<StoreApi<AuthStore> | null>(null);

const createAuthStore = (
  initProps?: Partial<Pick<AuthStore, 'isLoggedIn' | 'currentProfile'>>,
) => {
  return createStore<AuthStore>()((set) => ({
    ...getDefaultInitialState(),
    ...initProps,
    setLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    setProfile: (profile: Nullable<UserSchema>) =>
      set({ currentProfile: profile }),
    setAuth: (isLoggedIn: boolean, profile: Nullable<UserSchema>) =>
      set({ isLoggedIn, currentProfile: profile }),
  }));
};

interface Props
  extends Partial<Pick<AuthStore, 'isLoggedIn' | 'currentProfile'>> {
  children: React.ReactNode;
}

export default function AuthProvider({ children, ...otherProps }: Props) {
  const storeRef = useRef<StoreApi<AuthStore>>(null);
  if (!storeRef.current) {
    // @ts-ignore
    storeRef.current = createAuthStore(otherProps);
  }
  return (
    <AuthContext.Provider value={storeRef.current}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext<T>(
  selector: (state: AuthStore) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(AuthContext);
  if (!store) {
    const error = new Error(
      'useContext: `context` is undefined. Seems you forgot to wrap component within the Provider',
    );
    error.name = 'ContextError';
    // @ts-ignore
    Error.captureStackTrace?.(error, useContext);
    throw error;
  }

  return useStore(store, selector, equalityFn);
}
