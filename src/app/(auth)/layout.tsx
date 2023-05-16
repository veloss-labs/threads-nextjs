import { redirect } from 'next/navigation';
import React from 'react';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { api } from '~/libs/api/server';

interface LayoutProps {
  children: React.JSX.Element;
}

export default async function Layout({ children }: LayoutProps) {
  const { session } = await api.users.session.fetch();
  if (session) {
    redirect(PAGE_ENDPOINTS.ROOT);
  }

  return <div className="min-h-screen">{children}</div>;
}
