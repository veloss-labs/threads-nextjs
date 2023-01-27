import '~/assets/css/globals.css';
import Provider from '~/store/provider';

// types
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
  isLoggedIn?: boolean;
  currentProfile?: any;
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <Provider pageProps={pageProps} isLoggedIn={false} currentProfile={null}>
      <Component {...pageProps} />;
    </Provider>
  );
}
