import React from 'react';
import MainLayout from '~/components/layout/main-layout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}
