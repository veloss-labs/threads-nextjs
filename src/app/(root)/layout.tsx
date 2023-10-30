import React from 'react';
import Header from '~/components/shared/header';
import MobileFooterNav from '~/components/shared/mobile-footer-nav';
import MainNav from '~/components/shared/main-nav';
import ThreadsInput from '~/components/write/threads-input';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex flex-col">
        <Header>
          <MainNav />
        </Header>
        <main className="flex-1">
          <div className="container max-w-2xl px-4">
            <ThreadsInput />
            {children}
          </div>
        </main>
        <MobileFooterNav />
      </div>
    </>
  );
}
