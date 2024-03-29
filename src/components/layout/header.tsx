import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between sm:h-20 sm:py-6">
          {children}
        </div>
      </div>
    </header>
  );
}
