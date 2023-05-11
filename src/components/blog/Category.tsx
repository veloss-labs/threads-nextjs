import React from 'react';
import Link from 'next/link';

interface CategoryProps {
  name: string;
  to: string;
}

export default function Category({ name, to }: CategoryProps) {
  return (
    <Link
      className="m-2 py-1 px-2 hover:text-blue-500 hover:underline"
      href={to}
    >
      {name}
    </Link>
  );
}
