import React from 'react';

interface ThreadEndCardProps {
  children: React.ReactNode;
}

export default function ThreadEndCard({ children }: ThreadEndCardProps) {
  return (
    <div className="w-full py-8">
      <p className="text-center text-slate-700 dark:text-slate-300">
        {children}
      </p>
    </div>
  );
}
