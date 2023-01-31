import React, { useState } from 'react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Client, { type ClientProps } from './client';

interface ProviderProps
  extends Pick<ClientProps, 'currentProfile' | 'isLoggedIn'> {
  children: React.ReactNode;
  pageProps: any;
}

export default function Provider({
  children,
  pageProps,
  ...otherProps
}: ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Client {...otherProps}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Client>
  );
}
