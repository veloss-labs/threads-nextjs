'server-only';
import { db } from '~/services/db/prisma';
import type {
  LikeListQuerySchema,
  ThreadListQuerySchema,
} from '~/services/threads/threads.query';
import { getThreadsSelector } from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

  getItems(input: ThreadListQuerySchema) {
    return db.thread.findMany({
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
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(input),
    });
  }

  getLikeItems(userId: string, input: LikeListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        userId,
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        likes: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getThreadsSelector(input),
    });
  }

  hasNextPage(endCursor: string | undefined, userId: string | undefined) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        ...(userId && {
          userId,
        }),
      },
    });
  }

  hasNextLikePage(endCursor: string | undefined, userId: string) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        userId,
        likes: {
          some: {
            userId,
          },
        },
      },
    });
  }

  count(userId: string | undefined) {
    return db.thread.count({
      where: {
        deleted: false,
        ...(userId && {
          userId,
        }),
      },
    });
  }

  likeCount(userId: string) {
    return db.thread.count({
      where: {
        deleted: false,
        userId,
        likes: {
          some: {
            userId,
          },
        },
      },
    });
  }
}

export const threadService = remember(
  'threadService',
  () => new ThreadService(),
);
