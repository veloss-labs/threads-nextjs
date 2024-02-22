import React from 'react';
import ThreadsForm from '~/components/write/threads-form';
import ThreadsTitle from '~/components/write/threads-title';

export default function Page() {
  return (
    <div className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10">
      <ThreadsTitle />
      <ThreadsForm type="thread" />
    </div>
  );
}
