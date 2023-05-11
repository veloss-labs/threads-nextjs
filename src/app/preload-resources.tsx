'use client';

import ReactDOM from 'react-dom';

export function PreloadResources() {
  // @ts-ignore
  ReactDOM.preconnect('https://fonts.googleapis.com');
  // @ts-ignore
  ReactDOM.preconnect('https://fonts.gstatic.com', {
    crossOrigin: 'anonymous',
  });
  return null;
}
