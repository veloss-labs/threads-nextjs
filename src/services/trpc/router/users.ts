import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import { userIdSchema } from '~/services/users/users.input';
import {
  listQuerySchema,
  searchQuerySchema,
} from '~/services/users/users.query';
import { userService } from '~/services/users/users.service';

export const usersRouter = createTRPCRouter({
  byId: protectedProcedure.input(userIdSchema).query(async ({ input }) => {
    try {
      return await userService.byId(input.userId);
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }),
  getSearchUsers: protectedProcedure
    .input(listQuerySchema)
    .query(async ({ input }) => {
      try {
        const [totalCount, list] = await Promise.all([
          userService.searchCount(input),
          userService.getSearchItems(input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await userService.hasSearchNextPage(input, endCursor)) > 0
          : false;

        return {
          totalCount,
          list,
          endCursor,
          hasNextPage,
        };
      } catch (error) {
        console.log('error', error);
        return {
          totalCount: 0,
          list: [],
          endCursor: null,
          hasNextPage: false,
        };
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
