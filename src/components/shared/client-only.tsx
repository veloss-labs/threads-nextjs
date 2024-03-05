'use client';
import React, { useSyncExternalStore } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptySubscribe = () => () => {};

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const value = useSyncExternalStore(
    emptySubscribe,
    () => 'client',
    () => 'server',
  );

  if (value === 'server') {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
