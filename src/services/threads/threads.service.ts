'server-only';
import { db } from '~/services/db/prisma';
import type { ThreadListQuerySchema } from '~/services/threads/threads.query';
import { getThreadsSelector } from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

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
}

export const threadService = remember(
  'threadService',
  () => new ThreadService(),
);
