import React from 'react';
import HeaderNav from './HeaderNav';
import HeaderLogo from './HeaderLogo';

export default function Header() {
  return (
    <div className="border-b border-border dark:border-gray-700 dark:text-gray-50 dark:bg-gray-800">
      <div className="section-x-inset-2xl py-4.5 h-full">
        <nav className="flex justify-between flex-col lg:flex-row lg:gap-6 h-full">
          {/* Logo Area */}
          <HeaderLogo />
          {/* Nav */}
          <HeaderNav />
        </nav>
      </div>
    </div>
  );
}
