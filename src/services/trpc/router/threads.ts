import * as z from 'zod';
import { Prisma } from '@prisma/client';
import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from '../core/trpc';
import { ThreadRawQuerySchema } from '~/services/threads/threads.model';

const schema = z
  .object({
    cursor: z.string().optional(),
    limit: z.number().optional().default(30),
    userId: z.string().optional(),
  })
  .optional();

const transformThread = (item: ThreadRawQuerySchema) => {
  {
    const {
      is_liked,
      is_reposted,
      created_at,
      user_id,
      name,
      username,
      email,
      image,
      user_profiles_bio,
      likes,
      comments,
      reposts,
      recent_likes,
      recent_comments,
      recent_reposts,
      ...reset
    } = item;
    return {
      ...reset,
      user: {
        id: user_id,
        name: name || null,
        username: username || null,
        email: email || null,
        image: image || null,
        profile: {
          bio: user_profiles_bio || null,
        },
      },
      createdAt: created_at,
      isLiked: Boolean(Number(is_liked)),
      isCommented:
        'is_commented' in item ? Boolean(Number(item.is_commented)) : false,
      isReposted: Boolean(Number(is_reposted)),
      count: {
        likes: Number(likes),
        comments: Number(comments),
        reposts: Number(reposts),
      },
      recent: {
        likes: JSON.parse(recent_likes || '[]'),
        comments: JSON.parse(recent_comments || '[]'),
        reposts: JSON.parse(recent_reposts || '[]'),
      },
    };
  }
};

const DEFAULT_LIMIT = 30;

export const threadsRouter = createTRPCRouter({
  getThreads: publicProcedure.input(schema).query(async ({ ctx, input }) => {
    try {
      const [totalCount, list] = await Promise.all([
        ctx.db.thread.count({
          where: {
            deleted: false,
            ...(input?.userId && {
              userId: input.userId,
            }),
          },
        }),
        ctx.db.thread.findMany({
          where: {
            deleted: false,
            ...(input?.userId && {
              userId: input.userId,
            }),
            id: input?.cursor
              ? {
                  lt: input.cursor,
                }
              : undefined,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: input?.limit ?? DEFAULT_LIMIT,
        }),
      ]);

      const endCursor = list.at(-1)?.id ?? null;
      const hasNextPage = endCursor
        ? (await ctx.db.thread.count({
            where: {
              id: {
                lt: endCursor,
              },
              deleted: false,
              ...(input?.userId && {
                userId: input.userId,
              }),
            },
          })) > 0
        : false;

      return {
        totalCount,
        list: list,
        endCursor,
        hasNextPage,
      };
    } catch (error) {
      console.log('error', error);
      return {};
    }
  }),
});
