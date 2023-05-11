import React from 'react';

interface LayoutProps {
  children: React.JSX.Element;
}

export default function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
