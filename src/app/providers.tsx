'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { Session } from 'next-auth';
import { TRPCReactProvider } from '~/services/trpc/react';

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: Props) {
  console.log('session', session);
  return (
    <SessionProvider session={session}>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
