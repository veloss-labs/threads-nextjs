import React from 'react';
import ThreadList from '~/components/shared/thread-list';
import ThreadsInput from '~/components/write/threads-input';
import { auth } from '~/services/auth';
import { api } from '~/services/trpc/server';

export default async function Pages() {
  const session = await auth();

  const initialData = await api.threads.getThreads({
    userId: session?.user?.id,
  });

  return (
    <>
      <ThreadsInput />
      <ThreadList userId={session?.user?.id} initialData={initialData} />
    </>
  );
}
