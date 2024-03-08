import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import {
  likeListQuerySchema,
  listQuerySchema,
} from '~/services/threads/threads.query';
import { threadService } from '~/services/threads/threads.service';
import { createInputSchema } from '~/services/threads/threads.input';

export const threadsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const { id } = await threadService.create(userId, input);
        const item = await threadService.byId(id);

        // 추천 스레드 계산

        return {
          ok: true,
          data: item,
        };
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          data: null,
        };
      }
    }),
  getThreads: protectedProcedure
    .input(listQuerySchema)
    .query(async ({ input }) => {
      try {
        const [totalCount, list] = await Promise.all([
          threadService.count(input),
          threadService.getItems(input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextPage(input, endCursor)) > 0
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
    .input(likeListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const [totalCount, list] = await Promise.all([
          threadService.likeCount(userId),
          threadService.getLikeItems(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextLikePage(userId, endCursor)) > 0
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
