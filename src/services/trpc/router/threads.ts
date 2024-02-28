import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import {
  cursorPaginationQuerySchema,
  listQuerySchema,
} from '~/services/threads/threads.query';
import { threadService } from '~/services/threads/threads.service';

export const threadsRouter = createTRPCRouter({
  getThreads: publicProcedure
    .input(listQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        const [totalCount, list] = await Promise.all([
          threadService.count(input?.userId),
          threadService.getItems(input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextPage(endCursor, input?.userId)) > 0
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
  getLikeThreads: protectedProcedure
    .input(cursorPaginationQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const [totalCount, list] = await Promise.all([
          threadService.likeCount(userId),
          threadService.getLikeItems(input, userId),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextLikePage(endCursor, userId)) > 0
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
