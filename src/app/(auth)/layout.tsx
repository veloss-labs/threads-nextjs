import React from 'react';
import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <div className="min-h-screen">{children}</div>;
}
