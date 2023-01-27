import React from 'react';
import { SSRProvider } from 'react-aria';
import AuthProvider, { type AuthStore } from './useAuthStore';

export interface ClientProps
  extends Pick<AuthStore, 'isLoggedIn' | 'currentProfile'> {
  children: React.ReactNode;
}

export default function Client({ children, ...otherProps }: ClientProps) {
  const store: Pick<AuthStore, 'isLoggedIn' | 'currentProfile'> = {
    ...(otherProps ?? {
      isLoggedIn: false,
      currentProfile: null,
    }),
  };

  return (
    <AuthProvider {...store}>
      <SSRProvider>{children}</SSRProvider>
    </AuthProvider>
  );
}
