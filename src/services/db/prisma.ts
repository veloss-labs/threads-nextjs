'server-only';
import { PrismaClient } from '@prisma/client';
import { env } from '../../app/env';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query', 'info', 'warn'],
    });
  }
  prisma = global.cachedPrisma;
}

export const db: PrismaClient = prisma;
