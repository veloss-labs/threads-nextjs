'server-only';
import { db } from '~/services/db/prisma';
import { getTagsSelector } from '~/services/db/selectors/tags';
import { remember } from '@epic-web/remember';
import type { CreateInputSchema } from '~/services/tags/tags.input';
import { env } from '~/app/env';

export class TagService {
  private readonly DEFAULT_LIMIT = 30;

  /**
   * @description 태그 상세 조회
   * @param {string} id - 태그 ID
   */
  byId(id: string) {
    return db.tag.findUnique({
      where: { id },
      select: getTagsSelector(),
    });
  }

  /**
   * @description 태그 이름으로 조회
   * @param {string} name - 태그 이름
   */
  byName(name: string) {
    return db.tag.findUnique({
      where: { name },
      select: getTagsSelector(),
    });
  }

  /**
   * @description 태그 생성
   * @param {string} userId - 유저 ID
   * @param {CreateInputSchema} input - 생성할 태그 데이터
   */
  create(_: string, input: CreateInputSchema) {
    return db.tag.create({
      select: getTagsSelector(),
      data: {
        name: input.name,
      },
    });
  }

  /**
   * @description 태그 스키마와 스레드 스키마를 연결
   * @param {string} tagId - 태그 ID
   * @param {string} threadId - 스레드 ID
   */
  async connectOrCreateTag(tagId: string, threadId: string) {
    const exists = await db.threadTag.findFirst({
      where: {
        threadId,
        tagId,
      },
    });

    if (exists) {
      return exists;
    }

    const data = await db.threadTag.create({
      data: {
        threadId,
        tagId,
      },
    });

    return data;
  }

  /**
   * @description 태그 스키마와 팔로우 태그 스키마를 연결
   * @param {string} userId - 유저 ID
   * @param {string} tagId - 태그 ID
   */
  async connectOrCreateFollowTag(userId: string, tagId: string) {
    const exists = await db.followTag.findFirst({
      where: {
        userId,
        tagId,
      },
    });

    if (exists) {
      return exists;
    }

    const data = await db.followTag.create({
      data: {
        userId,
        tagId,
      },
    });

    return data;
  }

  /**
   * @description 멘션 팝업 리스트에서 보여주기 위한 유저 리스트 조회
   * @param {string} keyword - 검색 키워드
   */
  getMentionTags(keyword: string) {
    return db.tag.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      take: 10,
      select: getTagsSelector(),
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

export const tagService =
  env.NODE_ENV === 'development'
    ? new TagService()
    : remember('tagService', () => new TagService());
