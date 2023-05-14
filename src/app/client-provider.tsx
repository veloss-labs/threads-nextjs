'use client';
import { api } from '~/libs/api/client';

interface ClientProvidersProps {
  children: React.JSX.Element;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <api.Provider>{children}</api.Provider>;
}
