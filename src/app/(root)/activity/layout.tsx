import { type Metadata } from 'next';
import React from 'react';
import ScrollNav from '~/components/activity/scroll-nav';
import { SITE_CONFIG } from '~/constants/constants';

export const metadata: Metadata = {
  title: `활동 • ${SITE_CONFIG.title}`,
  openGraph: {
    title: `활동 • ${SITE_CONFIG.title}`,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="space-y-3">
      <ScrollNav />
      <div>{children}</div>
    </div>
  );
}
