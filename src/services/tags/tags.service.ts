'server-only';
import { db } from '~/services/db/prisma';
import { getTagsSelector } from '~/services/db/selectors/tags';
import { remember } from '@epic-web/remember';
import type { CreateInputSchema } from '~/services/tags/tags.input';

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
  async create(userId: string, input: CreateInputSchema) {
    const tag = await db.tag.create({
      select: getTagsSelector(),
      data: {
        name: input.name,
      },
    });

    await this.connectOrCreateFollowTag(userId, tag.id);

    return tag;
  }

  /**
   * @description 태그 스키마와 팔로우 태그 스키마를 연결
   * @param {string} userId - 유저 ID
   * @param {string} tagId - 태그 ID
   */
  connectOrCreateFollowTag(userId: string, tagId: string) {
    const exists = db.followTag.findFirst({
      where: {
        userId,
        tagId,
      },
    });

    if (exists) {
      return exists;
    }

    return db.followTag.create({
      data: {
        userId,
        tagId,
      },
    });
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

export const tagService = remember('tagService', () => new TagService());
