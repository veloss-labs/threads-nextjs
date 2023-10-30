import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import { db } from '~/server/db/prisma';

export default async function Pages() {
  const data = await db.thread.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="container max-w-2xl px-4 pb-10 pt-0 lg:py-10">
      <ThreadList items={data} />
    </div>
  );
}
