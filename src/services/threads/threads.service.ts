'server-only';
import { db } from '~/services/db/prisma';
import type {
  LikeListQuerySchema,
  ThreadListQuerySchema,
} from '~/services/threads/threads.query';
import { getThreadsSelector } from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';
import type { CreateInputSchema } from './threads.input';
// import { computeTFIDF, cosineSimilarity } from '~/utils/utils';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

  /**
   * @description 스레드 생성
   * @param {string} userId - 사용자 ID
   * @param {CreateInputSchema} input - 생성할 스레드 데이터
   */
  async create(userId: string, input: CreateInputSchema) {
    const data = await db.thread.create({
      select: {
        id: true,
      },
      data: {
        userId,
        text: input.text,
        jsonString: input.htmlJSON,
      },
    });

    return data;
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

// async recommendThreads(threadId: string) {
//   // 1. 데이터베이스에서 스레드 데이터 가져오기
//   const threads = await db.thread.findMany({
//     where: { deleted: false },
//     select: { id: true, text: true },
//   });

//   // 2. TF-IDF 계산
//   const documents = threads.map((thread) => thread.text);
//   const tfidf = computeTFIDF(documents);

//   // 3. 코사인 유사도 계산
//   const targetIndex = threads.findIndex((thread) => thread.id === threadId);
//   const similarities = tfidf.map((doc, index) => ({
//     id: threads[index]?.id,
//     // @ts-expect-error index is not undefined
//     similarity: cosineSimilarity(tfidf[targetIndex], doc),
//   }));

//   // 유사도가 가장 높은 스레드를 정렬하여 반환
//   const sorted = similarities.sort((a, b) => b.similarity - a.similarity);
//   return sorted.slice(1, 11); // Top 10, 자기 자신을 제외
// }
