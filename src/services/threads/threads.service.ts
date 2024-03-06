'server-only';
import { db } from '~/services/db/prisma';
import type {
  LikeListQuerySchema,
  ThreadListQuerySchema,
} from '~/services/threads/threads.query';
import { getThreadsSelector } from '~/services/db/selectors/threads';
import { remember } from '@epic-web/remember';
import type { CreateInputSchema } from './threads.input';
import { computeTFIDF, cosineSimilarity } from '~/utils/utils';

export class ThreadService {
  private readonly DEFAULT_LIMIT = 30;

  create(userId: string, input: CreateInputSchema) {
    return db.thread.create({
      data: {
        userId,
        text: input.text,
      },
    });
  }

  getItem(id: string) {
    return db.thread.findUnique({
      where: {
        id,
      },
      select: getThreadsSelector(),
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

  hasNextPage(endCursor: string | undefined, input: ThreadListQuerySchema) {
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

  hasNextLikePage(endCursor: string | undefined, userId: string) {
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

  async recommendThreads(threadId: string) {
    // 1. 데이터베이스에서 스레드 데이터 가져오기
    const threads = await db.thread.findMany({
      where: { deleted: false },
      select: { id: true, text: true },
    });

    // 2. TF-IDF 계산
    const documents = threads.map((thread) => thread.text);
    const tfidf = computeTFIDF(documents);

    // 3. 코사인 유사도 계산
    const targetIndex = threads.findIndex((thread) => thread.id === threadId);
    const similarities = tfidf.map((doc, index) => ({
      id: threads[index].id,
      similarity: cosineSimilarity(tfidf[targetIndex], doc),
    }));

    // 유사도가 가장 높은 스레드를 정렬하여 반환
    const sorted = similarities.sort((a, b) => b.similarity - a.similarity);
    return sorted.slice(1, 11); // Top 10, 자기 자신을 제외
  }
}

export const threadService = remember(
  'threadService',
  () => new ThreadService(),
);
