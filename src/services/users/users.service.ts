'server-only';

import { remember } from '@epic-web/remember';
import { type Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import omit from 'lodash-es/omit';

import type {
  SignInInputSchema,
  SignUpInputSchema,
  UpdateProfileInputSchema,
} from '~/services/users/users.input';

import { env } from '~/app/env';
import { API_ENDPOINTS } from '~/constants/constants';
import { db } from '~/services/db/prisma';
import { getAuthCredentialsSelector } from '~/services/db/selectors/auth';
import { getUserSelector } from '~/services/db/selectors/users';
import { signInSchema } from '~/services/users/users.input';
import { generateHash, generateSalt, secureCompare } from '~/utils/password';
import { generatorName } from '~/utils/utils';

export class UserService {
  /**
   * @description next-auth credentials authorize
   * @param {Partial<Record<'username' | 'password', unknown>>} credentials - 인증 정보
   * @param {Request?} _ - 요청 객체
   */
  async authorize(
    credentials: Partial<Record<'username' | 'password', unknown>>,
    _?: Request,
  ) {
    const input = signInSchema.safeParse(credentials);
    if (!input.success) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: JSON.stringify({
          name: input.error.name,
          message: input.error.message,
        }),
      });
    }

    return await userService.getAuthCredentials(input.data);
  }

  /**
   * @description 회원가입
   * @param {SignUpInputSchema} input - 회원가입 정보
   */
  async signup(input: SignUpInputSchema) {
    const user = await db.user.findFirst({
      where: {
        username: input.username,
      },
    });

    if (user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '이미 사용 중인 아이디입니다.',
      });
    }

    const salt = generateSalt();
    const hash = generateHash(input.password, salt);

    const searchParams = new URLSearchParams();
    searchParams.append('seed', input.username);
    const defaultImage = API_ENDPOINTS.avatar(searchParams);
    const name = generatorName(input.username);

    const data = await db.user.create({
      data: {
        name,
        username: input.username,
        password: hash,
        salt,
        image: defaultImage,
        profile: {
          create: {
            bio: undefined,
            website: undefined,
          },
        },
      },
    });

    return data;
  }

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
   * @description 프로필 업데이트
   * @param {string} userId - 유저 ID
   * @param {UpdateProfileInputSchema} input - 프로필 업데이트 정보
   */
  async update(userId: string, input: UpdateProfileInputSchema) {
    const item = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        profile: true,
      },
    });

    if (!item) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'item not found' });
    }

    return db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: input.name,
        profile: {
          update: {
            bio: input.bio,
            website: input.website,
          },
        },
      },
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
   * @param {SignInInputSchema} credentials - 아이디, 비밀번호 인증 정보
   */
  async getAuthCredentials(credentials: SignInInputSchema) {
    const user = await db.user.findUnique({
      where: {
        username: credentials.username,
      },
      select: getAuthCredentialsSelector(),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '존재하지 않는 아이디입니다.',
      });
    }

    if (user.password && user.salt) {
      if (
        !secureCompare(
          user.password,
          generateHash(credentials.password, user.salt),
        )
      ) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '비밀번호가 일치하지 않습니다.',
        });
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
