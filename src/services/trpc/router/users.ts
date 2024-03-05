import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import { userIdSchema } from '~/services/users/users.input';
import { listQuerySchema } from '~/services/users/users.query';
import { userService } from '~/services/users/users.service';

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure.input(userIdSchema).query(async ({ input }) => {
    try {
      const user = await userService.getItem(input.userId);
      return user;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }),
  getSearchUsers: publicProcedure
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
});
