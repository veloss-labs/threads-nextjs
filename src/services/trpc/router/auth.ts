import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/services/trpc/core/trpc';

export const authRouter = createTRPCRouter({
  getRequireSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
