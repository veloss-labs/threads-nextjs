import React from 'react';
import Category from '~/components/blog/Category';

interface LayoutProps {
  children: React.JSX.Element;
}

export default function Layout({ children }: LayoutProps) {
  const categories = [
    {
      name: 'Engineering',
      to: '/?tag=engineering',
    },
    {
      name: 'How To',
      to: '/?tag=how-to',
    },
    {
      name: 'Product Update',
      to: '/?tag=product-update',
    },
    {
      name: 'Fresh',
      to: '/?tag=fresh',
    },
    {
      name: 'Announcements',
      to: '/?tag=announcements',
    },
    {
      name: 'Deno Deploy',
      to: '/?tag=deno-deploy',
    },
    {
      name: 'Deploy',
      to: '/?tag=deploy',
    },
    {
      name: 'Partnerships',
      to: '/?tag=partnerships',
    },
  ];
  return (
    <main className="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 className="text-5xl font-display font-bold">Blog</h1>
      <div className="flow-root mt-8 text-sm text-gray-400">
        <div className="-m-4 flex flex-row flex-wrap">
          {categories.map((category) => (
            <Category
              key={`Category-${category.name}`}
              name={category.name}
              to={category.to}
            />
          ))}
        </div>
      </div>
      {children}
    </main>
  );
}
