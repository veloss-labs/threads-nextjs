'server-only';
import { db } from '~/server/db/prisma';
import { isString } from '~/utils/assertion';
import { SEARCH_SELECT } from '~/services/search/search.selector';
import type { SearchQuery } from '~/services/search/search.query';

export class SearchService {
  getSearch(userId: string, query: SearchQuery) {
    return this._getSearchByCursor(userId, query);
  }

  getDefaultItems<Data = any>() {
    return {
      totalCount: 0,
      list: [] as Data[],
      endCursor: null,
      hasNextPage: false,
    };
  }

  private async _getSearchByCursor(
    userId: string,
    { cursor, limit }: SearchQuery,
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
      db.user.count({
        where: {
          id: {
            not: userId,
          },
        },
      }),
      db.user.findMany({
        orderBy: [
          {
            id: 'desc',
          },
        ],
        where: {
          id: cursor
            ? {
                lt: cursor,
                not: userId,
              }
            : undefined,
        },
        take: limit,
        select: SEARCH_SELECT,
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.user.count({
          where: {
            id: {
              lt: endCursor,
              not: userId,
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

export const searchService = new SearchService();
