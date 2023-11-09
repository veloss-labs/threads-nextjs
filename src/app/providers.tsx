'use client';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AppProvider } from '~/libs/providers/app';
import { ThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface Props {
  children: React.ReactNode;
  theme?: ThemeProviderProps;
}

export function Providers({ children, theme }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider {...theme}>
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
