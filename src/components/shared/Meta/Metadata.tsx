import React from 'react';
import Script from 'next/script';
import { Partytown } from '@builder.io/partytown/react';
import { gaTrackingID } from '~/constants/env';

const Metadata = () => {
  return (
    <>
      <Partytown debug={true} forward={['dataLayer.push']} />
      <Script
        type='text/partytown'
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingID}`}
      />
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaTrackingID}', { 
              page_path: window.location.pathname,
          });
      `,
        }}
      />
    </>
  );
};

export default Metadata;
