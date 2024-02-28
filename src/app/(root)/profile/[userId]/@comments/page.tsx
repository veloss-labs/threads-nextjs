import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import { api } from '~/services/trpc/server';

interface Props {
  params: {
    userId: string;
  };
}

export default async function Pages({ params }: Props) {
  const initialData = await api.threads.getThreads({
    userId: params.userId,
  });

  return <ThreadList userId={params.userId} initialData={initialData} />;
}
