import React from 'react';
import { cookies } from 'next/headers';
import MainLayout from '~/components/layout/main-layout';
import { getSession } from '~/server/auth';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();
  if (session && session.user && !session.user.isActive) {
    cookies().delete('next-auth.session-token');
    redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
  }

  return <MainLayout>{children}</MainLayout>;
}
