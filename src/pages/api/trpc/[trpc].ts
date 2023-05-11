import { type NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContextInner } from '~/server/api/context';
import { appRouter } from '~/server/api/root';
import { env } from '~/env/server.mjs';

export default function handler(req: NextRequest) {
  return fetchRequestHandler({
    req,
    endpoint: '/api/trpc',
    router: appRouter,
    // @ts-expect-error
    createContext() {
      return createContextInner({
        req,
      });
    },
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });
}
