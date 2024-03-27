import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { SITE_CONFIG } from '~/constants/constants';
import { api } from '~/services/trpc/server';

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

export default async function Layout({ children }: Props) {
  const session = await api.auth.getRequireSession();

  if (!session) {
    notFound();
  }

  return <>{children}</>;
}
