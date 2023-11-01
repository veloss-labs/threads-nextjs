import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="relative flex grow flex-col self-center py-4">
      {children}
    </div>
  );
}
