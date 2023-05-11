import React from 'react';
import Header from '~/components/blog/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen">
      <Header />
      {children}
    </div>
  );
}
