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
   * @param {string} userId - 사용자 ID
   * @param {CreateInputSchema} input - 생성할 태그 데이터
   */
  create(userId: string, input: CreateInputSchema) {
    return db.tag.create({
      select: getTagsSelector(),
      data: { name: input.name },
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
