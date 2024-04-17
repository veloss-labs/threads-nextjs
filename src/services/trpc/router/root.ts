import { createTRPCRouter } from '~/services/trpc/core/trpc';
import { authRouter } from './auth';
import { commonRouter } from './common';
import { searchRouter } from './search';
import { tagsRouter } from './tags';
import { threadsRouter } from './threads';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  threads: threadsRouter,
  users: usersRouter,
  tags: tagsRouter,
  search: searchRouter,
  common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
