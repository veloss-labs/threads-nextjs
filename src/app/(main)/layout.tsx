import React from 'react';
import Header from '~/components/blog/Header';
import { api } from '~/libs/api/server';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const { greeting } = await api.example.hello.fetch({
    text: 'Test RSC TRPC Call',
  });
  console.log(greeting);
  return (
    <div className="h-screen">
      <Header />
      {children}
    </div>
  );
}
