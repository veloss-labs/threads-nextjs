import React from 'react';
import SkeletonCard from '~/components/skeleton/card-user';

interface SkeletonCardUserListProps {
  makeCount?: number;
}

export default function SkeletonCardUserList({
  makeCount = 5,
}: SkeletonCardUserListProps) {
  return (
    <>
      {Array.from({ length: makeCount }).map((_, i) => (
        <SkeletonCard key={`skeleton:loading:${i}`} />
      ))}
    </>
  );
}
