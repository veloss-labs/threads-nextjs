import { PrismaClient } from '@prisma/client';
import { env } from '~/env/server.mjs';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db: PrismaClient = prisma;
