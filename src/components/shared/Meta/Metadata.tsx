/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import { Partytown } from '@builder.io/partytown/react';
import { gaTrackingID } from '~/constants/env';
// NEXT_PUBLIC_GA_TRACKING_ID=G-VJVQ6GT7EG

const Metadata = () => {
  return (
    <>
      <Partytown debug={true} forward={['dataLayer.push']} />
      <script
        type="text/partytown"
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
