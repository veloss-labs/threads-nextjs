import { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG } from '~/constants/constants';

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `검색 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `검색 • ${SITE_CONFIG.title}`,
  },
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative flex grow flex-col self-center py-4">
      {children}
    </div>
  );
}
