import { authRouter } from './auth';
import { threadsRouter } from './threads';
import { usersRouter } from './users';
import { tagsRouter } from './tags';
import { createTRPCRouter } from '~/services/trpc/core/trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  threads: threadsRouter,
  users: usersRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
