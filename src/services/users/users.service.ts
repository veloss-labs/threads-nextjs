'server-only';
import omit from 'lodash-es/omit';
import { generateHash, secureCompare } from '~/utils/password';
import { db } from '~/services/db/prisma';
import { getUserSelector } from '~/services/db/selectors/users';
import { getAuthCredentialsSelector } from '~/services/db/selectors/auth';
import { Prisma } from '@prisma/client';
import type { AuthFormData } from '~/services/users/users.input';
import { remember } from '@epic-web/remember';
import { env } from '~/app/env';
import { TRPCError } from '@trpc/server';

export class UserService {
  private readonly DEFAULT_LIMIT = 30;

  /**
   * @description 유저 팔로우
   * @param {string} userId - 팔로우 하는 유저 ID
   * @param {string} targetId - 팔로우 대상 유저 ID
   */
  async follow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '자신을 팔로우 할 수 없습니다.',
      });
    }

    const following = await this.byId(userId);
    if (!following) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '팔로우 정보를 찾을 수 없습니다.',
      });
    }

    const follower = await this.byId(targetId);
    if (!follower) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '팔로우 대상을 찾을 수 없습니다.',
      });
    }

    const exists = await db.userFollow.findFirst({
      where: {
        userId,
        followerId: targetId,
      },
    });

    if (exists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '이미 팔로우 중입니다.',
      });
    }

    const relationship = await db.userFollow.create({
      data: {
        userId,
        followerId: targetId,
      },
    });

    return relationship;
  }

  /**
   * @description 유저 언팔로우
   * @param {string} userId - 팔로우 하는 유저 ID
   * @param {string} targetId - 팔로우 대상 유저 ID
   */
  async unfollow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '자신을 언팔로우 할 수 없습니다.',
      });
    }

    const following = await this.byId(userId);
    if (!following) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '팔로우 정보를 찾을 수 없습니다.',
      });
    }

    const follower = await this.byId(targetId);
    if (!follower) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '팔로우 대상을 찾을 수 없습니다.',
      });
    }

    const relationship = await db.userFollow.deleteMany({
      where: {
        userId,
        followerId: targetId,
      },
    });

    return relationship;
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
   * @description 유저 아이디로 조회
   * @param {string} userId - 유저 ID
   * @param {string?} sessionUserId - 조회하는 유저 ID
   */
  byId(userId: string, sessionUserId?: string) {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: getUserSelector(sessionUserId),
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
      select: getAuthCredentialsSelector(),
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

export const userService =
  env.NODE_ENV === 'development'
    ? new UserService()
    : remember('userService', () => new UserService());
