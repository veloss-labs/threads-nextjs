import React from 'react';
import Script from 'next/script';
import { Partytown } from '@builder.io/partytown/react';
import { deployGroup, environment, gaTrackingID } from '~/constants/env';

const Scripts = () => {
  const renderGaScript = () => {
    if (!gaTrackingID) return null;
    return (
      <>
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
      </>
    );
  };

  const renderPartytownScript = () => {
    if (!gaTrackingID) return null;

    return (
      <Partytown debug={deployGroup === 'local'} forward={['dataLayer.push']} />
    );
  };

  return (
    <>
      {renderPartytownScript()}
      {renderGaScript()}
    </>
  );
};

export default Scripts;
