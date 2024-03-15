'server-only';
import { Prisma, ThreadLike, type Thread } from '@prisma/client';
import { type UserSelectSchema, getUserSelector } from './users';
import { type ThreadListQuerySchema } from '~/services/threads/threads.query';

export const getRecommendationsSelector = () =>
  Prisma.validator<Prisma.ThreadRecommendationSelect>()({
    id: true,
    similarity: true,
    thread: {
      select: getThreadsSelector(),
    },
    recommendedThread: {
      select: getThreadsSelector(),
    },
  });

export const getStatsSelector = () =>
  Prisma.validator<Prisma.ThreadStatsSelect>()({
    id: true,
    threadId: true,
    likes: true,
    score: true,
  });

export const getRecommendationsWithThreadSelector = (
  input?: ThreadListQuerySchema,
) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getUserSelector(),
    },
    stats: {
      select: getStatsSelector(),
    },
    threadRecommendationThreads: {
      select: getRecommendationsSelector(),
    },
  });

export const getThreadsSelector = (
  userId?: string,
  input?: ThreadListQuerySchema,
) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getUserSelector(),
    },
    likes: userId ? { where: { userId } } : false,
    _count: {
      select: {
        likes: true,
      },
    },
  });

export type ThreadSelectSchema = Pick<
  Thread,
  | 'id'
  | 'text'
  | 'level'
  | 'createdAt'
  | 'deleted'
  | 'hiddenNumberOfLikesAndComments'
  | 'whoCanLeaveComments'
> & {
  user: UserSelectSchema;
  _count: {
    likes: number;
  };
  likes: ThreadLike[];
};
