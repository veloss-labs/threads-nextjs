'server-only';
import omit from 'lodash-es/omit';
import { generateHash, secureCompare } from '~/utils/password';
import { db } from '~/services/db/prisma';
import { getUserSelector } from '~/services/db/selectors/users';
import { AUTH_CRDENTIALS_USER_SELECT } from '~/services/db/selectors/auth';
import { Prisma } from '@prisma/client';
import type { AuthFormData } from './users.input';
import { remember } from '@epic-web/remember';
import { type UserListQuerySchema } from '~/services/users/users.query';

export class UserService {
  private readonly DEFAULT_LIMIT = 30;

  /**
   * @description 유저 검색시 나오는 총 갯수
   * @param {UserListQuerySchema} input - 유저 목록 조회 조건
   */
  searchCount(input: UserListQuerySchema) {
    return db.user.count({
      where: {
        username: {
          contains: input?.keyword,
        },
      },
    });
  }

  /**
   * @description 유저 검색시 다음 페이지가 있는지 확인
   * @param {UserListQuerySchema} input - 유저 목록 조회 조건
   * @param {string | undefined} endCursor - 마지막 커서
   */
  hasSearchNextPage(input: UserListQuerySchema, endCursor: string | undefined) {
    return db.user.count({
      where: {
        id: {
          lt: endCursor,
        },
        username: {
          contains: input?.keyword,
        },
      },
    });
  }

  /**
   * @description 계정 생성
   * @param {Prisma.UserCreateInput | Prisma.UserUncheckedCreateInput} input - 유저 생성 정보
   */
  create(
    input: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  ) {
    return db.user.create({
      data: input,
    });
  }

  /**
   * @description 유저 검색시 나오는 목록 조회
   * @param {UserListQuerySchema} input - 유저 목록 조회 조건
   */
  getSearchItems(input: UserListQuerySchema) {
    return db.user.findMany({
      where: {
        id: input?.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
        username: {
          contains: input?.keyword,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input?.limit ?? this.DEFAULT_LIMIT,
      select: getUserSelector(),
    });
  }

  /**
   * @description 유저 아이디로 조회
   * @param {string} userId - 유저 ID
   */
  byId(userId: string) {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: getUserSelector(),
    });
  }

  /**
   * @description 유저 이름으로 조회
   * @param {string} username - 유저 이름
   */
  byUsername(username: string) {
    return db.user.findUnique({
      where: {
        username,
      },
      select: getUserSelector(),
    });
  }

  /**
   * @description 인증된 유저 정보 조회
   * @param {AuthFormData} credentials - 아이디, 비밀번호 인증 정보
   */
  async getAuthCredentials(credentials: AuthFormData) {
    const user = await db.user.findUnique({
      where: {
        username: credentials.username,
      },
      select: AUTH_CRDENTIALS_USER_SELECT,
    });

    if (!user) {
      return null;
    }

    if (user.password && user.salt) {
      if (
        !secureCompare(
          user.password,
          generateHash(credentials.password, user.salt),
        )
      ) {
        return null;
      }
    }

    return omit(user, ['password', 'salt']);
  }

  /**
   * @description 멘션 팝업 리스트에서 보여주기 위한 유저 리스트 조회
   * @param {string} keyword - 검색 키워드
   * @param {string} userId - 유저 ID
   */
  getMentionUsers(keyword: string, userId: string) {
    return db.user.findMany({
      where: {
        id: {
          not: userId,
        },
        username: {
          contains: keyword,
        },
      },
      take: 10,
      select: getUserSelector(),
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

export const userService = remember('userService', () => new UserService());
