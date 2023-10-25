import React from 'react';
import { getSession } from '~/server/auth';

export default async function Pages() {
  const session = await getSession();
  console.log(`[session] ===>`, session);
  return <div>Pages</div>;
}
