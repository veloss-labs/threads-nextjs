import {
  createInputSchema,
  detailInputSchema,
  idInputSchema,
  updateInputSchema,
} from '~/services/threads/threads.input';
import {
  bookmarkListQuerySchema,
  followListQuerySchema,
  likeListQuerySchema,
  listQuerySchema,
  recommendationListQuerySchema,
  repostListQuerySchema,
} from '~/services/threads/threads.query';
import { threadService } from '~/services/threads/threads.service';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';

export const threadsRouter = createTRPCRouter({
  simpleById: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input, ctx }) => {
      try {
        return await threadService.simpleById(input.threadId);
      } catch (error) {
        console.log('error', error);
        return null;
      }
    }),
  byId: protectedProcedure
    .input(detailInputSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        return await threadService.byIdWithSession(
          userId,
          input.userId,
          input.threadId,
        );
      } catch (error) {
        console.log('error', error);
        return null;
      }
    }),
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
  repost: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const item = await threadService.repost(userId, input);
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
        const item = await threadService.byId(userId, data.id);
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
        const item = await threadService.byId(userId, data.id);

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
  getReposts: protectedProcedure
    .input(repostListQuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      try {
        const [totalCount, list] = await Promise.all([
          threadService.repostCount(userId, input),
          threadService.getReposts(userId, input),
        ]);

        const endCursor = list.at(-1)?.id ?? null;
        const hasNextPage = endCursor
          ? (await threadService.hasRepostPage(userId, endCursor, input)) > 0
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
