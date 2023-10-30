'use client';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AppProvider } from '~/libs/providers/app';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>{children}</AppProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
