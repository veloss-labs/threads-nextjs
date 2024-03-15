import React from 'react';
import SkeletonCard from '~/components/skeleton/card-thread';

interface SkeletonCardThreadListProps {
  makeCount?: number;
}

export default function SkeletonCardThreadList({
  makeCount = 5,
}: SkeletonCardThreadListProps) {
  return (
    <>
      {Array.from({ length: makeCount }).map((_, i) => (
        <SkeletonCard key={`skeleton:loading:${i}`} />
      ))}
    </>
  );
}
