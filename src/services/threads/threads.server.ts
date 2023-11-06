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
import { ThreadSelectSchema, ThreadRawQuerySchema } from './threads.model';

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

    try {
      const [totalCount, list] = await Promise.all([
        db.thread.count({
          where: {
            deleted,
            ...(userId && {
              userId,
            }),
          },
        }),
        db.$queryRaw<ThreadRawQuerySchema[]>`
      SELECT threads.id, threads.type, threads.text, threads.level, threads.deleted, threads.created_at,
      (SELECT COUNT(*) FROM thread_likes WHERE thread_id = threads.id AND user_id = ${currentUserId}) as is_liked,
      (SELECT COUNT(*) FROM thread_likes WHERE thread_id = threads.id) as likes,
      (SELECT COUNT(*) FROM thread_comments WHERE thread_id = threads.id) as comments,
      (SELECT COUNT(*) FROM thread_reposts WHERE thread_id = threads.id) as reposts,
      users.id as user_id, users.name, users.username, users.email, users.image,
      (SELECT bio FROM user_profiles WHERE user_id = users.id) as user_profiles_bio,
      (
        SELECT json_group_array(JSON_OBJECT('id', thread_likes.id, 'created_at', thread_likes.created_at))
        FROM thread_likes WHERE thread_id = threads.id ORDER BY created_at DESC LIMIT 3
      ) as recent_likes,
      (
        SELECT json_group_array(JSON_OBJECT('id', thread_comments.id, 'created_at', thread_comments.created_at))
        FROM thread_comments WHERE thread_id = threads.id ORDER BY created_at DESC LIMIT 3
      ) as recent_comments,
      (
        SELECT json_group_array(JSON_OBJECT('id', thread_reposts.id, 'created_at', thread_reposts.created_at))
        FROM thread_reposts WHERE thread_id = threads.id ORDER BY created_at DESC LIMIT 3
      ) as recent_reposts
      FROM threads
      INNER JOIN users ON threads.user_id = users.id
      ${
        cursor
          ? Prisma.sql`WHERE threads.id < ${cursor} AND threads.deleted = ${deleted} ${
              userId
                ? Prisma.sql`AND threads.user_id = ${userId}`
                : Prisma.empty
            }`
          : Prisma.sql`WHERE threads.deleted = ${deleted} ${
              userId
                ? Prisma.sql`AND threads.user_id = ${userId}`
                : Prisma.empty
            }`
      }
      ORDER BY threads.id DESC
      LIMIT ${limit}`,
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
        list: this._serializeRawQueryItem(list),
        endCursor,
        hasNextPage,
      };
    } catch (error) {
      console.log('error', error);
      return this.getDefaultItems();
    }
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

  private _serializeRawQueryItem(list: ThreadRawQuerySchema[]) {
    return list.map((item) => {
      const {
        is_liked,
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
        isReposted:
          'is_reposted' in item ? Boolean(Number(item.is_reposted)) : false,
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
    });
  }
}

export const threadService = new ThreadService();
