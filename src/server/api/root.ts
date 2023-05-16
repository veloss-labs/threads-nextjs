import { exampleRouter } from '~/server/api/routers/example';
import { usersRouter } from '~/server/api/routers/users';
import { createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
