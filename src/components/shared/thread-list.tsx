'use client';
import React, { useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import ThreadItem from '~/components/shared/thread-item';

interface ThreadListProps {
  items: any[];
}

export default function ThreadList({ items }: ThreadListProps) {
  const ref = useRef<VirtuosoHandle>(null);

  return (
    <Virtuoso
      ref={ref}
      useWindowScroll
      data={items}
      components={{
        Footer: () => <div className="h-20 md:h-0" />,
      }}
      initialItemCount={items.length}
      itemContent={(index, item) => {
        return <ThreadItem item={item} />;
      }}
    />
  );
}
