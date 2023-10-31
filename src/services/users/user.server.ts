'server-only';
import omit from 'lodash-es/omit';
import { generateHash, secureCompare } from '~/server/utils/password';
import { db } from '~/server/db/prisma';
import {
  USER_SELECT,
  AUTH_CRDENTIALS_USER_SELECT,
} from '~/services/users/user.selector';

export class UserService {
  async get(userId: string) {
    const data = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: USER_SELECT,
    });
    return data;
  }

  async getAuthCredentials(credentials: {
    username: string;
    password: string;
  }) {
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
