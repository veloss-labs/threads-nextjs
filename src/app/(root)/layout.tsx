import React from 'react';
import Topbar from '~/components/shared/top-bar';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Topbar />
      <main className="flex flex-row">
        {/* <LeftSidebar /> */}
        <section className="main-container">
          <div className="w-full max-w-4xl">{children}</div>
        </section>
        {/* @ts-ignore */}
        {/* <RightSidebar /> */}
      </main>
    </>
  );
}
