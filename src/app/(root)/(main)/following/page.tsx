import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const initialData = await api.threads.getThreads();

  return <ThreadList initialData={initialData} />;
}
