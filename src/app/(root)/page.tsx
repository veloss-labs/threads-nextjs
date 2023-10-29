import React from 'react';
import ThreadItem from '~/components/shared/thread-item';
import { db } from '~/server/db/prisma';

export default async function Pages() {
  const data = await db.thread.findMany({ include: { user: true } });
  return (
    <div className="container max-w-2xl pb-10 pt-0 lg:py-10">
      {data.map((item) => (
        <ThreadItem key={`thread-${item.id}`} item={item} />
      ))}
    </div>
  );
}
