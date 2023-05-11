import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeaderLogo() {
  return (
    <div className="h-9 flex flex-1 items-center justify-between lg:justify-start select-none w-full lg:w-min gap-3 md:gap-6 lg:gap-8">
      <Link href="/" className="flex items-center flex-none gap-4">
        <Image
          src="/images/next.svg"
          alt="Next.js Logo"
          className="text-default h-6 flex-none dark:text-gray-900"
          width={150}
          height={30}
          priority
        />
      </Link>
    </div>
  );
}
