import React from 'react';
import Header from '~/components/shared/header';
import MobileFooterNav from '~/components/shared/mobile-footer-nav';
import MainNav from '~/components/shared/main-nav';

interface MainLayoutProps {
  before?: React.ReactNode;
  children: React.ReactNode;
  after?: React.ReactNode;
}

export default function MainLayout({
  children,
  before,
  after,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col">
      <Header>
        <MainNav />
      </Header>
      <main className="flex-1">
        <div className="container max-w-2xl px-4">
          {before}
          {children}
          {after}
        </div>
      </main>
      <MobileFooterNav />
    </div>
  );
}
