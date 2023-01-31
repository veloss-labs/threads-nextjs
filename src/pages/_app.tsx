import '~/assets/css/globals.css';
import Provider from '~/store/provider';
import { setApiEnv } from '~/api/env';

// types
import type { NextPage } from 'next';
import type { AppContext, AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface AppPropsWithLayout
  extends AppProps,
    Pick<NextPage, 'getInitialProps'> {
  Component: NextPageWithLayout;
  isLoggedIn: boolean;
  currentProfile?: any;
}

export default function App({
  Component,
  pageProps,
  isLoggedIn,
  currentProfile,
}: AppPropsWithLayout) {
  return (
    <Provider
      pageProps={pageProps}
      isLoggedIn={isLoggedIn}
      currentProfile={currentProfile}
    >
      <Component {...pageProps} />;
    </Provider>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  setApiEnv(ctx);

  let pageProps = {};
  // 하위 컴포넌트에 getInitialProps가 있다면 추가 (각 개별 컴포넌트에서 사용할 값 추가)
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  // _app에서 props 추가 (모든 컴포넌트에서 공통적으로 사용할 값 추가)
  pageProps = { ...pageProps };

  return {
    pageProps,
    isLoggedIn: false,
    currentProfile: null,
  };
};
