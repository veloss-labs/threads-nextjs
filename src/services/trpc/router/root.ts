import { authRouter } from './auth';
import { createTRPCRouter } from '../core/trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
