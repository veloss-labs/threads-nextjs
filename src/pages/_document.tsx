import { Html, Head, Main, NextScript } from 'next/document';
import Metadata from '~/components/shared/Meta/Metadata';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Metadata />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
