import React, { useMemo } from 'react';
import Script from 'next/script';
import { Partytown } from '@builder.io/partytown/react';
import { deployGroup, gaTrackingID } from '~/constants/env';

const Scripts = () => {
  const disabled = useMemo(() => !gaTrackingID || deployGroup === 'local', []);
  // const disabled = useMemo(() => false, []);

  if (disabled) {
    return null;
  }

  return (
    <>
      <Partytown debug={deployGroup === 'local'} forward={['dataLayer.push']} />
      <Script
        id="ga-script"
        type="text/partytown"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingID}`}
      />
      <Script
        id="ga-script"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* <Script
        id="sw-script"
        type="text/partytown"
        src="/sw.js"
        data-service-worker="true"
      /> */}
    </>
  );
};

export default Scripts;
