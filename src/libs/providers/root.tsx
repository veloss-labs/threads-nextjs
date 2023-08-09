'use client';
import { api } from '~/@trpc/next-layout/client/client';

interface ProvidersProps {
  children: React.JSX.Element;
}

export function RootProviders({ children }: ProvidersProps) {
  return <api.Provider>{children}</api.Provider>;
}
