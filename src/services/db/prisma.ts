'server-only';
import { remember } from '@epic-web/remember';
import { PrismaClient } from '@prisma/client';

function getClient() {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({
    log: ['error', 'warn', 'query'],
  });

  return client;
}

export const db = remember('prisma', getClient);
