import { redirect } from 'next/navigation';
import React from 'react';
import MainLayout from '~/components/layout/main-layout';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { auth } from '~/services/auth';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session) {
    redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
  }

  return <MainLayout>{children}</MainLayout>;
}
