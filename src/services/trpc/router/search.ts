import {
  searchQuerySchema,
  searchUsersQuerySchema,
} from '~/services/search/search.query';
import { searchService } from '~/services/search/search.service';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';

export const searchRouter = createTRPCRouter({
  getSearch: protectedProcedure
    .input(searchQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        if (input?.searchType === 'tags') {
          return await searchService.getSearchThreads(userId, input);
        }
        return await searchService.getSearchUsers(userId, input);
      } catch (error) {
        console.log('error', error);
        return {
          type: input?.searchType === 'tags' ? 'threads' : 'users',
          totalCount: 0,
          list: [],
          endCursor: null,
          hasNextPage: false,
        };
      }
    }),
  getSearchDialogUsers: protectedProcedure
    .input(searchUsersQuerySchema)
    .query(async ({ input }) => {
      return await searchService.getSearchDialogUsers(input);
    }),
});
