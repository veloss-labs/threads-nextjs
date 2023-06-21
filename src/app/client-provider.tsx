'use client';
import { api } from '~/@trpc/next-layout/client/client';

interface ClientProvidersProps {
  children: React.JSX.Element;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <api.Provider>{children}</api.Provider>;
}
