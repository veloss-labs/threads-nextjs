import { authRouter } from './auth';
import { threadsRouter } from './threads';
import { createTRPCRouter } from '../core/trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  threads: threadsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
