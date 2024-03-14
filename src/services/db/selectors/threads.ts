'server-only';
import { Prisma, type Thread } from '@prisma/client';
import {
  type UserSelectSchema,
  getUserSelector,
  getFollowWithUserSelector,
} from './users';
import { type ThreadListQuerySchema } from '~/services/threads/threads.query';

export const getRecommendationsSelector = () =>
  Prisma.validator<Prisma.ThreadRecommendationSelect>()({
    id: true,
    similarity: true,
    user: {
      select: getUserSelector(),
    },
    thread: {
      select: getThreadsSelector(),
    },
    recommendedThread: {
      select: getThreadsSelector(),
    },
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
    recommendations: {
      select: getRecommendationsSelector(),
    },
    threadRecommendationThreads: {
      select: getRecommendationsSelector(),
    },
  });

export const getFollowsWithThreadSelector = (input?: ThreadListQuerySchema) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getFollowWithUserSelector(),
    },
  });

export const getThreadsSelector = (input?: ThreadListQuerySchema) =>
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
};
