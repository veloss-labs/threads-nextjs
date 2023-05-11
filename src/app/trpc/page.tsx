import React from 'react';
import { api } from '~/libs/api/server';

export default async function Page() {
  const { greeting } = await api.example.hello.fetch({
    text: 'Test RSC TRPC Call',
  });

  return <div>Page {greeting}</div>;
}
