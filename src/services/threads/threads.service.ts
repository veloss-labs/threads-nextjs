'server-only';
import { db } from '~/services/db/prisma';
import type {
  LikeListQuerySchema,
  ThreadListQuerySchema,
} from '~/services/threads/threads.query';
import {
  getThreadsSelector,
  getRecommendationsWithThreadSelector,
} from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';
import type { CreateInputSchema } from './threads.input';
import { tagService } from '~/services/tags/tags.service';
import { userService } from '../users/users.service';
import {
  computeTFIDFById,
  cosineSimilarity,
  getFindByLexicalNodeTypes,
} from '~/utils/utils';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

  private readonly DEFAULT_RECOMMENDATION_SIMILARITY = 0.1;

  /**
   * @description 스레드 생성
   * @param {string} userId - 사용자 ID
   * @param {CreateInputSchema} input - 생성할 스레드 데이터
   */
  async create(userId: string, input: CreateInputSchema) {
    const { text, htmlJSON, mentions, hashTags } = input;

    const connectTags: string[] = [];
    if (hashTags) {
      const _verifiedTags: string[] = [];
      for (const tag of hashTags) {
        const foundTag = await tagService.byName(tag);
        if (!foundTag) {
          const data = await tagService.create(userId, { name: tag });
          _verifiedTags.push(data.id);
        } else {
          _verifiedTags.push(foundTag.id);
        }
      }
      connectTags.push(..._verifiedTags);
    }

    const connectMentions: string[] = [];
    if (mentions) {
      const _verifiedMentions: string[] = [];
      for (const mention of mentions) {
        const data = await userService.byUsername(mention);
        if (data) {
          _verifiedMentions.push(data.id);
        }
      }
      connectMentions.push(..._verifiedMentions);
    }

    return await db.thread.create({
      select: {
        id: true,
      },
      data: {
        userId,
        text,
        jsonString: htmlJSON,
        mentions: {
          create: connectMentions.map((userId) => ({
            userId,
          })),
        },
        tags: {
          create: connectTags.map((tagId) => ({
            tagId,
          })),
        },
      },
    });
  }

  /**
   * @description 자동 페이지네이션을 통해 추천 스레드 계산
   * @param {string} threadId - 스레드 ID
   */
  async autoPaginationComputeRecommendations(userId: string, threadId: string) {
    const totalCount = await db.thread.count({
      where: { deleted: false },
    });

    const fns: Map<
      string,
      ReturnType<typeof this.computeRecommendations>
    > = new Map();

    for (let i = 0; i < Math.ceil(totalCount / this.DEFAULT_LIMIT); i++) {
      const threads = await db.thread.findMany({
        where: {
          deleted: false,
        },
        skip: i * this.DEFAULT_LIMIT,
        take: this.DEFAULT_LIMIT,
        select: {
          id: true,
          jsonString: true,
        },
      });
      fns.set(i.toString(), this.computeRecommendations(threadId, threads));
    }

    const items = await Promise.all(fns.values());
    const flatItems = items.flatMap((item) => item);

    const fetchItems = [];
    for (const item of flatItems) {
      const fetchItem = db.threadRecommendation.create({
        data: {
          threadId,
          userId,
          recommendedThreadId: item.id,
          similarity: item.similarity,
        },
      });
      fetchItems.push(fetchItem);
    }

    await Promise.all(fetchItems);

    return true;
  }

  /**
   * @description threadId를 기반으로 유사한 스레드를 추천합니다.
   * @param {string} threadId - 스레드 ID
   * @param {{ id: string; jsonString: string | null }[]} threads - 스레드 목록
   */
  async computeRecommendations(
    threadId: string,
    threads: { id: string; jsonString: string | null }[],
  ) {
    const documents = threads
      .filter((thread) => thread.jsonString)
      .map((thread) => {
        const htmlJSON = JSON.parse(thread.jsonString ?? '{}');
        const lexicalNodes = getFindByLexicalNodeTypes(
          ['text', 'mention', 'hashtag'],
          htmlJSON,
        );
        return lexicalNodes
          .filter(
            (node) =>
              node.type === 'text' ||
              node.type === 'mention' ||
              node.type === 'hashtag',
          )
          .map((node) => {
            return {
              id: thread.id,
              text: node.node.text,
            };
          })
          .filter((node) => node.text);
      })
      .flatMap((doc) => doc);

    const tfidfMap = computeTFIDFById(documents);

    const similarities: any[] = [];
    for (const [id, doc] of tfidfMap) {
      const similarity = cosineSimilarity(
        tfidfMap.get(threadId) ?? new Map(),
        doc,
      );
      similarities.push({
        id,
        similarity: isNaN(similarity) ? 0 : similarity,
      });
    }

    const sorted = similarities
      .filter((similarity) => similarity.id !== threadId)
      .sort((a, b) => b.similarity - a.similarity);

    return sorted;
  }

  /**
   * @description 스레드 상세 조회
   * @param {string} id - 스레드 ID
   */
  byId(id: string) {
    return db.thread.findUnique({
      where: {
        id,
      },
      select: getThreadsSelector(),
    });
  }

  /**
   * @description 스레드 목록 조회
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
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

  /**
   * @description 추천 스레드 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
  async getRecommendations(userId: string, input: ThreadListQuerySchema) {
    return db.thread.findMany({
      where: {
        deleted: false,
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        userId,
        recommendations: {
          some: {
            AND: [
              {
                similarity: {
                  gte: this.DEFAULT_RECOMMENDATION_SIMILARITY,
                },
              },
              {
                thread: {
                  user: {
                    id: {
                      notIn: [userId],
                    },
                  },
                },
              },
              {
                user: {
                  id: {
                    notIn: [userId],
                  },
                },
              },
            ],
          },
        },
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getRecommendationsWithThreadSelector(input),
    });
  }

  /**
   * @description 좋아요한 스레드 목록 조회
   * @param {string} userId
   * @param {LikeListQuerySchema} input
   */
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

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   */
  hasNextPage(input: ThreadListQuerySchema, endCursor: string | undefined) {
    return db.thread.count({
      where: {
        id: {
          lt: endCursor,
        },
        deleted: false,
        ...(input?.userId && {
          userId: input.userId,
        }),
      },
    });
  }

  /**
   * @description endCursor 이후에 다음 페이지가 있는지 확인
   * @param {string} userId - 스레드 목록 조회 조건
   * @param {string} endCursor - 스레드 ID
   */
  hasNextLikePage(userId: string, endCursor: string | undefined) {
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

  /**
   * @description 스레드 목록 조회 총 개수
   * @param {ThreadListQuerySchema} input - 스레드 목록 조회 조건
   */
  count(input: ThreadListQuerySchema) {
    return db.thread.count({
      where: {
        deleted: false,
        ...(input?.userId && {
          userId: input.userId,
        }),
      },
    });
  }

  /**
   * @description 좋아요 스레드 목록 조회 총 개수
   * @param {string} userId - 스레드 목록 조회 조건
   */
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
