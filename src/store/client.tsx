import React from 'react';
import DefaultSeo from '~/components/shared/Seo/DefaultSeo';
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
    <>
      <DefaultSeo />
      <AuthProvider {...store}>{children}</AuthProvider>
    </>
  );
}
