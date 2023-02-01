import React from 'react';
import { NextSeo } from 'next-seo';

// types
import type { NextSeoProps } from 'next-seo';

interface SeoProps extends NextSeoProps {}

const Seo: React.FC<SeoProps> = (props) => {
  return <NextSeo {...props} />;
};

export default Seo;
