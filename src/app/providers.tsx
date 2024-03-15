'use client';
import { ThemeProvider } from 'next-themes';
import { TRPCReactProvider } from '~/services/trpc/react';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
