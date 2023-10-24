'use client';

interface ProvidersProps {
  children: React.JSX.Element;
}

export function RootProviders({ children }: ProvidersProps) {
  return <>{children}</>;
}
