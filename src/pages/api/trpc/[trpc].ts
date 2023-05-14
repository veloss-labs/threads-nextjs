import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext as ctx } from '~/server/api/context';
import { appRouter } from '~/server/api/root';

export default createNextApiHandler({
  router: appRouter,
  createContext(opts) {
    return ctx({
      type: 'api',
      ...opts,
    });
  },
});
