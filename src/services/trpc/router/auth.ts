import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';

export const authRouter = createTRPCRouter({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
