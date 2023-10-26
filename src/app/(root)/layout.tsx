import React from 'react';
import Header from '~/components/shared/header';
import MobileFooterNav from '~/components/shared/mobile-footer-nav';
import MainNav from '~/components/shared/main-nav';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header>
          <MainNav />
        </Header>
        <main className="flex-1">{children}</main>
        <MobileFooterNav />
      </div>
    </>
  );
}
