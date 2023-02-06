import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import Scripts from '~/components/shared/Partytown/Scripts';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Scripts />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
