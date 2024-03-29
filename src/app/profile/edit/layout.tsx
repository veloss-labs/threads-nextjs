import { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG } from '~/constants/constants';

interface Props {
  children: React.ReactNode;
  params: {
    userId: string;
  };
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export const metadata: Metadata = {
  title: `프로필 편집 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `프로필 편집 • ${SITE_CONFIG.title}`,
  },
};

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
