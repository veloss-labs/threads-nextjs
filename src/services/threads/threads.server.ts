'server-only';
import { db } from '~/server/db/prisma';
import { isEmpty, isString } from '~/utils/assertion';
import {
  THREADS_SELECT,
  THREADS_REPOST_SELECT,
  THREADS_COMMENT_SELECT,
} from '~/services/threads/threads.selector';
import type { ThreadQuery } from '~/services/threads/threads.query';
import { Prisma } from '@prisma/client';
import { ThreadSelectSchema } from './threads.model';

export class ThreadService {
  countLikes(threadId: string) {
    return db.threadLike.count({
      where: {
        threadId,
      },
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
    } catch (e) {
      console.log('e', e);
    }

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
      } catch (e) {
        console.log('e', e);
      }
    }

    return await this.countLikes(threadId);
  }

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

  createRepost(
    data: Prisma.XOR<
      Prisma.ThreadRepostCreateInput,
      Prisma.ThreadRepostUncheckedCreateInput
    >,
  ) {
    return db.threadRepost.create({
      data,
    });
  }

  updateItem(
    threadId: string,
    data: Prisma.XOR<
      Prisma.ThreadUpdateInput,
      Prisma.ThreadUncheckedUpdateInput
    >,
  ) {
    return db.thread.update({
      where: {
        id: threadId,
      },
      data,
    });
  }

  deleteItem(threadId: string) {
    return db.thread.delete({
      where: {
        id: threadId,
      },
    });
  }

  deleteItems(threadId: string) {
    return db.thread.deleteMany({
      where: {
        id: threadId,
      },
    });
  }

  getItemsById(id: string, currentUserId?: string) {
    return db.thread.findUnique({
      where: {
        id,
      },
      select: THREADS_SELECT(currentUserId),
    });
  }

  getItemRepostsById(id: string, currentUserId?: string) {
    return db.threadRepost.findUnique({
      where: {
        id,
      },
      select: THREADS_REPOST_SELECT(currentUserId),
    });
  }

  getItems(query: ThreadQuery, currentUserId?: string) {
    switch (query.type) {
      case 'repost': {
        return this._getItemRepostsByCursor(query, currentUserId);
      }
      case 'comment': {
        return this._getItemCommentsByCursor(query, currentUserId);
      }
      default: {
        return this._getItemsByCursor(query, currentUserId);
      }
    }
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

  private async _getItemsByCursor(
    { cursor, limit, userId, deleted = false }: ThreadQuery,
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

  private async _getItemRepostsByCursor(
    { cursor, type, limit, userId, deleted = false }: ThreadQuery,
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
      db.threadRepost.count({
        where: {
          repost: {
            type,
            deleted,
            ...(userId && {
              userId,
            }),
          },
        },
      }),
      db.threadRepost.findMany({
        orderBy: [
          {
            repost: {
              id: 'desc',
            },
          },
        ],
        where: {
          repost: {
            id: cursor
              ? {
                  lt: cursor,
                }
              : undefined,
            type,
            deleted,
            ...(userId && {
              userId,
            }),
          },
        },
        take: limit,
        select: THREADS_REPOST_SELECT(currentUserId),
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.threadRepost.count({
          where: {
            repost: {
              id: {
                lt: endCursor,
              },
              type,
              deleted,
              ...(userId && {
                userId,
              }),
            },
          },
          orderBy: [
            {
              repost: {
                id: 'desc',
              },
            },
          ],
        })) > 0
      : false;

    return {
      totalCount,
      list: this._serializeItems(list.map((item) => item.repost)),
      endCursor,
      hasNextPage,
    };
  }

  private async _getItemCommentsByCursor(
    { cursor, type, limit, userId, deleted = false }: ThreadQuery,
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
      db.threadComment.count({
        where: {
          comment: {
            type,
            deleted,
            ...(userId && {
              userId,
            }),
          },
        },
      }),
      db.threadComment.findMany({
        orderBy: [
          {
            comment: {
              id: 'desc',
            },
          },
        ],
        where: {
          comment: {
            id: cursor
              ? {
                  lt: cursor,
                }
              : undefined,
            type,
            deleted,
            ...(userId && {
              userId,
            }),
          },
        },
        take: limit,
        select: THREADS_COMMENT_SELECT(currentUserId),
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.threadComment.count({
          where: {
            comment: {
              id: {
                lt: endCursor,
              },
              type,
              deleted,
              ...(userId && {
                userId,
              }),
            },
          },
          orderBy: [
            {
              comment: {
                id: 'desc',
              },
            },
          ],
        })) > 0
      : false;

    return {
      totalCount,
      list: this._serializeItems(list.map((item) => item.comment)),
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

  private _serializeItems(list: ThreadSelectSchema[]) {
    return list.map((item) => {
      const { likes, comments, reposts, ...reset } = item;
      return {
        ...reset,
        isLiked: !isEmpty(likes),
        isCommented: !isEmpty(comments),
        isReposted: !isEmpty(reposts),
      };
    });
  }
}

export const threadService = new ThreadService();
