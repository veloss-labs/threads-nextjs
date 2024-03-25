import { authRouter } from './auth';
import { threadsRouter } from './threads';
import { usersRouter } from './users';
import { tagsRouter } from './tags';
import { searchRouter } from './search';
import { commonRouter } from './common';
import { createTRPCRouter } from '~/services/trpc/core/trpc';

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
