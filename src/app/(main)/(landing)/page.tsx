import React from 'react';
import PostCard from '~/components/blog/PostCard';

export default function Page() {
  return (
    <div className="mt-8">
      {Array.from({ length: 10 }).map((_, i) => (
        <PostCard key={i} />
      ))}
    </div>
  );
}
