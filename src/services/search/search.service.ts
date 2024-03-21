'server-only';
import { remember } from '@epic-web/remember';
import { env } from '~/app/env';
import type {
  SearchQuerySchema,
  SearchUsersQuerySchema,
} from '~/services/search/search.query';
import { db } from '~/services/db/prisma';
import { getUserSelector } from '~/services/db/selectors/users';
import { getThreadsSelector } from '~/services/db/selectors/threads';

export class SearchService {
  private readonly DEFAULT_LIMIT = 30;

  /**
   * @description 대화 검색시 나오는 목록 조회
   * @param {SearchUsersQuerySchema} input - 조회 조건
   */
  async getSearchDialogUsers(input: SearchUsersQuerySchema) {
    return db.user.findMany({
      where: {
        username: {
          contains: input?.keyword,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: getUserSelector(),
    });
  }

  /**
   * @description 유저 검색시 나오는 목록 조회
   * @param {string} userId - 유저 아이디
   * @param {SearchQuerySchema} input - 조회 조건
   */
  async getSearchUsers(userId: string, input: SearchQuerySchema) {
    const [totalCount, list] = await Promise.all([
      db.user.count({
        where: {
          username: {
            contains: input?.keyword,
          },
          ...(input?.searchType === 'mentions' &&
            input.userId && {
              threadMention: {
                some: {
                  userId: input?.userId,
                },
              },
            }),
        },
      }),
      db.user.findMany({
        where: {
          id: input?.cursor
            ? {
                lt: input.cursor,
              }
            : undefined,
          username: {
            contains: input?.keyword,
          },
          ...(input?.searchType === 'mentions' &&
            input.userId && {
              threadMention: {
                some: {
                  userId: input?.userId,
                },
              },
            }),
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input?.limit ?? this.DEFAULT_LIMIT,
        select: getUserSelector(userId),
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.user.count({
          where: {
            id: {
              lt: endCursor,
            },
            username: {
              contains: input?.keyword,
            },
            ...(input?.searchType === 'mentions' &&
              input.userId && {
                threadMention: {
                  some: {
                    userId: input?.userId,
                  },
                },
              }),
          },
        })) > 0
      : false;

    return {
      type: 'users' as const,
      totalCount,
      list,
      endCursor,
      hasNextPage,
    };
  }

  /**
   * @description 스레드 검색시 나오는 목록 조회
   * @param {string} userId - 유저 아이디
   * @param {SearchQuerySchema} input - 조회 조건
   */
  async getSearchThreads(userId: string, input: SearchQuerySchema) {
    const [totalCount, list] = await Promise.all([
      db.thread.count({
        where: {
          ...(input?.searchType === 'tags' &&
            input.tagId && {
              tags: {
                some: {
                  tagId: input?.tagId,
                },
              },
              text: {
                contains: input?.keyword,
              },
            }),
        },
      }),
      db.thread.findMany({
        where: {
          id: input?.cursor
            ? {
                lt: input.cursor,
              }
            : undefined,
          ...(input?.searchType === 'tags' &&
            input.tagId && {
              tags: {
                some: {
                  tagId: input?.tagId,
                },
              },
              text: {
                contains: input?.keyword,
              },
            }),
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input?.limit ?? this.DEFAULT_LIMIT,
        select: getThreadsSelector(userId),
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.thread.count({
          where: {
            id: {
              lt: endCursor,
            },
            ...(input?.searchType === 'tags' &&
              input.tagId && {
                tags: {
                  some: {
                    tagId: input?.tagId,
                  },
                },
                text: {
                  contains: input?.keyword,
                },
              }),
          },
        })) > 0
      : false;

    return {
      type: 'threads' as const,
      totalCount,
      list,
      endCursor,
      hasNextPage,
    };
  }
}

export const searchService =
  env.NODE_ENV === 'development'
    ? new SearchService()
    : remember('searchService', () => new SearchService());
