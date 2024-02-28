import React from 'react';
import { auth } from '~/services/auth';
import { notFound } from 'next/navigation';
import { api } from '~/services/trpc/server';
import ThreadLikeList from '~/components/shared/thread-likes-list';

export default async function Pages() {
  const session = await auth();
  if (!session) {
    notFound();
  }

  const initialData = await api.threads.getLikeThreads();

  return <ThreadLikeList initialData={initialData} />;
}
