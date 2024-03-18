import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import {
  likeListQuerySchema,
  listQuerySchema,
  bookmarkListQuerySchema,
  recommendationListQuerySchema,
  followListQuerySchema,
} from '~/services/threads/threads.query';
import { threadService } from '~/services/threads/threads.service';
import {
  updateInputSchema,
  createInputSchema,
  idInputSchema,
} from '~/services/threads/threads.input';

export const threadsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const item = await threadService.like(userId, input);
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
  save: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const item = await threadService.save(userId, input.threadId);
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
  update: protectedProcedure
    .input(updateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const data = await threadService.update(userId, input);
        const item = await threadService.byId(data.id);
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
  create: protectedProcedure
    .input(createInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const data = await threadService.create(userId, input);
        const item = await threadService.byId(data.id);

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
  delete: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        await threadService.delete(userId, input.threadId);
        return {
          ok: true,
          data: null,
        };
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          data: null,
        };
      }
    }),
  getItems: protectedProcedure
    .input(listQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          threadService.count(userId, input),
          threadService.getItems(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextPage(endCursor, input)) > 0
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
  getRecommendations: protectedProcedure
    .input(recommendationListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          threadService.recommendCount(userId, input),
          threadService.getRecommendations(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasRecommendPage(userId, endCursor, input)) > 0
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
  getFollows: protectedProcedure
    .input(followListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          threadService.followCount(userId, input),
          threadService.getFollows(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasFollowPage(userId, endCursor, input)) > 0
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
  getLikes: protectedProcedure
    .input(likeListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const [totalCount, list] = await Promise.all([
          threadService.likeCount(userId, input),
          threadService.getLikes(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasNextLikePage(userId, endCursor, input)) > 0
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
  getBookmarks: protectedProcedure
    .input(bookmarkListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const [totalCount, list] = await Promise.all([
          threadService.bookmarkCount(userId, input),
          threadService.getBookmarks(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasBookmarkPage(userId, endCursor, input)) > 0
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
