import React from 'react';
import SkeletonCard from '~/components/skeleton/card';

interface SkeletonCardListProps {
  makeCount?: number;
}

export default function SkeletonCardList({
  makeCount = 5,
}: SkeletonCardListProps) {
  return (
    <>
      {Array.from({ length: makeCount }).map((_, i) => (
        <SkeletonCard key={`skeleton:loading:${i}`} />
      ))}
    </>
  );
}
