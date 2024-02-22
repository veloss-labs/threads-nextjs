'server-only';
import omit from 'lodash-es/omit';
import { generateHash, secureCompare } from '~/server/utils/password';
import { db } from '~/services/db/prisma';
import {
  USER_SELECT,
  AUTH_CRDENTIALS_USER_SELECT,
} from '~/services/users/users.selector';
import { Prisma } from '@prisma/client';
import type { AuthFormData } from './users.input';

export class UserService {
  // 유저 생성
  async createItem(
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  ) {
    return db.user.create({
      data,
    });
  }

  // 유저 아이디로 조회
  async getItem(userId: string) {
    const data = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: USER_SELECT,
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
}

export const userService = new UserService();
