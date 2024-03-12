'server-only';
import { db } from '~/services/db/prisma';
import { remember } from '@epic-web/remember';
// import { computeTFIDF, cosineSimilarity } from '~/utils/utils';

export class MentionService {
  /**
   * @description 유저 스키마와 스레드 스키마를 연결
   * @param {string} userId - 유저 ID
   * @param {string} threadId - 스레드 ID
   */
  async connectOrCreateMention(userId: string, threadId: string) {
    const exists = await db.threadMention.findFirst({
      where: {
        userId,
        threadId,
      },
    });

    if (exists) {
      return exists;
    }

    return db.threadMention.create({
      data: {
        userId,
        threadId,
      },
    });
  }
}

export const mentionService = remember(
  'mentionService',
  () => new MentionService(),
);
