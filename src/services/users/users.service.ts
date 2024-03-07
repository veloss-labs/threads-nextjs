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

  // 유저 생성
  async createItem(
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  ) {
    return db.user.create({
      data,
    });
  }

  async searchCount(input: UserListQuerySchema) {
    return db.user.count({
      where: {
        username: {
          contains: input?.keyword,
        },
      },
    });
  }

  async getSearchItems(input: UserListQuerySchema) {
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
  // 유저 아이디로 조회
  async getItem(userId: string) {
    const data = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: getUserSelector(),
    });
    return data;
  }

  // 유저 이름으로 조회
  async getItemByUsername(username: string) {
    const data = await db.user.findUnique({
      where: {
        username,
      },
    });
    return data;
  }

  // 인증된 유저 정보 조회
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

  // 멘션 팝업 리스트에서 보여주기 위한 유저 리스트 조회
  async getMentionUsers(keyword: string, userId: string) {
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
