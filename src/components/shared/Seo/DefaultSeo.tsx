import React, { useMemo } from 'react';
import { DefaultSeo as NextDefaultSeo } from 'next-seo';
import { siteURL } from '~/constants/env';

export const Title = 'SST NextJS Template';
export const Description = 'Build your next project with NextJS';
export const Author = 'SST NextJS Template';

const DefaultSeo = () => {
  const SEO_CONSTANTS = useMemo(
    () => ({
      title: Title,
      canonical: siteURL,
      description: Description,
      additionalLinkTags: [
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
      additionalMetaTags: [
        {
          name: 'author',
          content: Author,
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
        {
          name: 'keywords',
          content: 'SST, NextJS, Template, React, TypeScript, JavaScript',
        },
      ],
    }),
    [],
  );

  return (
    <>
      <NextDefaultSeo {...SEO_CONSTANTS} />
    </>
  );
};

export default DefaultSeo;
