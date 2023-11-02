'server-only';
import { db } from '~/server/db/prisma';
import { isEmpty, isString } from '~/utils/assertion';
import { THREADS_SELECT } from '~/services/threads/threads.selector';
import type {
  ThreadQuery,
  SearchThreadQuery,
} from '~/services/threads/threads.query';
import { Prisma } from '@prisma/client';
import { ThreadSelectSchema } from './threads.model';

export class ThreadService {
  createItme(
    data: Prisma.XOR<
      Prisma.ThreadCreateInput,
      Prisma.ThreadUncheckedCreateInput
    >,
  ) {
    return db.thread.create({
      data,
    });
  }

  async unlikeItem(threadId: string, userId: string) {
    try {
      await db.threadLike.delete({
        where: {
          threadId_userId: {
            threadId,
            userId,
          },
        },
      });
    } catch (e) {}

    return await this.countLikes(threadId);
  }

  async likeItem(threadId: string, userId: string) {
    const alreadyLiked = await db.threadLike.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!alreadyLiked) {
      try {
        await db.threadLike.create({
          data: {
            threadId,
            userId,
          },
        });
      } catch (e) {}
    }

    return await this.countLikes(threadId);
  }

  countLikes(threadId: string) {
    return db.threadLike.count({
      where: {
        threadId,
      },
    });
  }

  getItems(query: ThreadQuery, currentUserId?: string) {
    return this._getItemsByCursor(query, currentUserId);
  }

  getLikes(userId: string, query: ThreadQuery) {
    return this._getLikesByCursor(userId, query);
  }

  getDefaultItems<Data = any>() {
    return {
      totalCount: 0,
      list: [] as Data[],
      endCursor: null,
      hasNextPage: false,
    };
  }

  private _serializeItems(list: ThreadSelectSchema[]) {
    return list.map((item) => {
      const { likes, ...reset } = item;
      return {
        ...reset,
        isLiked: !isEmpty(likes),
      };
    });
  }

  private async _getItemsByCursor(
    {
      cursor,
      limit,
      userId,
      hasRepost = false,
      hasParent = false,
      deleted = false,
    }: ThreadQuery,
    currentUserId?: string,
  ) {
    if (isString(cursor)) {
      cursor = cursor;
    }

    if (isString(limit)) {
      limit = Number(limit);
    } else {
      limit = limit ?? 25;
    }

    const [totalCount, list] = await Promise.all([
      db.thread.count({
        where: {
          deleted,
          ...(userId && {
            userId,
          }),
          ...(hasParent && {
            parentId: {
              not: null,
            },
          }),
          ...(hasRepost && {
            repostId: {
              not: null,
            },
          }),
        },
      }),
      db.thread.findMany({
        orderBy: [
          {
            id: 'desc',
          },
        ],
        where: {
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
          ...(userId && {
            userId,
          }),
          ...(hasParent && {
            parentId: {
              not: null,
            },
          }),
          ...(hasRepost && {
            repostId: {
              not: null,
            },
          }),
          deleted,
        },
        take: limit,
        select: THREADS_SELECT(currentUserId),
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.thread.count({
          where: {
            id: {
              lt: endCursor,
            },
            deleted,
            ...(userId && {
              userId,
            }),
            ...(hasParent && {
              parentId: {
                not: null,
              },
            }),
            ...(hasRepost && {
              repostId: {
                not: null,
              },
            }),
          },
          orderBy: [
            {
              id: 'desc',
            },
          ],
        })) > 0
      : false;

    return {
      totalCount,
      list: this._serializeItems(list),
      endCursor,
      hasNextPage,
    };
  }

  private async _getLikesByCursor(
    userId: string,
    { cursor, limit, deleted = false }: ThreadQuery,
  ) {
    if (isString(cursor)) {
      cursor = cursor;
    }

    if (isString(limit)) {
      limit = Number(limit);
    } else {
      limit = limit ?? 25;
    }

    const [totalCount, list] = await Promise.all([
      db.threadLike.count({
        where: {
          userId,
          thread: {
            deleted,
          },
        },
      }),
      db.threadLike.findMany({
        orderBy: [
          {
            id: 'desc',
          },
        ],
        where: {
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
          userId,
          thread: {
            deleted,
          },
        },
        take: limit,
        select: {
          id: true,
          thread: {
            select: THREADS_SELECT(userId),
          },
        },
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.threadLike.count({
          where: {
            id: {
              lt: endCursor,
            },
            userId,
            thread: {
              deleted,
            },
          },
          orderBy: [
            {
              id: 'desc',
            },
          ],
        })) > 0
      : false;

    return {
      totalCount,
      list: this._serializeItems(list.map((item) => item.thread)),
      endCursor,
      hasNextPage,
    };
  }
}

export const threadService = new ThreadService();
