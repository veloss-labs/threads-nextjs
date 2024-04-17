import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import {
  followUserSchema,
  updateProfileSchema,
  userIdSchema,
} from '~/services/users/users.input';
import { searchQuerySchema } from '~/services/users/users.query';
import { userService } from '~/services/users/users.service';

export const usersRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return await userService.follow(userId, input.targetId);
    }),
  unfollow: protectedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return await userService.unfollow(userId, input.targetId);
    }),
  byId: protectedProcedure.input(userIdSchema).query(async ({ input, ctx }) => {
    try {
      const sessionUserId = ctx.session.user.id;
      return await userService.byId(input.userId, sessionUserId);
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }),
  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        return await userService.update(userId, input);
      } catch (error) {
        console.log('error', error);
        return null;
      }
    }),
  getMentionUsers: protectedProcedure
    .input(searchQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        if (!input.keyword) {
          return [];
        }

        const userId = ctx.session.user.id;

        return await userService.getMentionUsers(input.keyword, userId);
      } catch (error) {
        console.log('error', error);
        return [];
      }
    }),
});
