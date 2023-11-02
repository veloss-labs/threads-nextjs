'server-only';
import { db } from '~/server/db/prisma';
import { isEmpty, isString } from '~/utils/assertion';
import { SEARCH_SELECT } from '~/services/search/search.selector';
import type { SearchQuery } from '~/services/search/search.query';

export class SearchService {
  getSearch(query: SearchQuery) {
    return this._getSearchByCursor(query);
  }

  getDefaultItems<Data = any>() {
    return {
      totalCount: 0,
      list: [] as Data[],
      endCursor: null,
      hasNextPage: false,
    };
  }

  private async _getSearchByCursor({ cursor, limit, q }: SearchQuery) {
    if (isString(cursor)) {
      cursor = cursor;
    }

    if (isString(limit)) {
      limit = Number(limit);
    } else {
      limit = limit ?? 25;
    }

    const selector = isEmpty(q)
      ? {}
      : {
          OR: [
            {
              username: {
                contains: q,
              },
            },
            {
              name: {
                contains: q,
              },
            },
            {
              email: {
                contains: q,
              },
            },
          ],
        };

    const [totalCount, list] = await Promise.all([
      db.user.count({
        where: {
          // id: {
          //   not: userId,
          // },
          ...selector,
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
                // not: userId,
              }
            : undefined,
          ...selector,
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
              // not: userId,
            },
            ...selector,
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
