import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => {
    return {
      session: ctx.session,
    };
  }),
});
