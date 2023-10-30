'server-only';
import { db } from '~/server/db/prisma';
import { isString } from '~/utils/assertion';
import type { BaseThreadQuery, ThreadQuery } from './threads.query';
import type { ThreadSchema } from './threads.model';

export class ThreadService {
  getItems(query: ThreadQuery): Promise<ThreadSchema> {
    if (query.type === 'page') {
      return this._getItemsByPage(query);
    } else {
      return this._getItemsByCursor(query);
    }
  }

  private async _getItemsByCursor({ cursor, limit }: BaseThreadQuery) {
    if (isString(cursor)) {
      cursor = cursor;
    }

    if (isString(limit)) {
      limit = Number(limit);
    } else {
      limit = limit ?? 25;
    }

    const [totalCount, list] = await Promise.all([
      db.thread.count(),
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
        },
        take: limit,
        include: {
          user: true,
        },
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.thread.count({
          where: {
            id: {
              lt: endCursor,
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
      list,
      endCursor,
      hasNextPage,
    };
  }

  private async _getItemsByPage({ pageNo, limit }: BaseThreadQuery) {
    if (isString(pageNo)) {
      pageNo = Number(pageNo);
    } else {
      pageNo = pageNo ?? 1;
    }

    if (isString(limit)) {
      limit = Number(limit);
    } else {
      limit = limit ?? 25;
    }

    const [totalCount, list] = await Promise.all([
      db.thread.count(),
      db.thread.findMany({
        orderBy: [
          {
            id: 'desc',
          },
        ],
        skip: (pageNo - 1) * limit,
        take: limit,
        include: {
          user: true,
        },
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.thread.count({
          where: {
            id: {
              lt: endCursor,
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
      list,
      endCursor,
      hasNextPage,
    };
  }
}

export const threadService = new ThreadService();
