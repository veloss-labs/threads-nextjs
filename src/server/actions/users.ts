'use server';
import { redirect } from 'next/navigation';

import { db } from '~/server/db/prisma';
import { generateHash, generateSalt } from '~/server/utils/password';
import { AUTH_CRDENTIALS_USER_SELECT } from '~/server/db/selector/user.selector';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';

type FormData = {
  username: string;
  password: string;
};

export const createUser = async (formData: FormData) => {
  try {
    const exists = await db.user.findUnique({
      where: {
        username: formData.username,
      },
    });

    if (exists) {
      return {
        data: null,
        resultCode: RESULT_CODE.ALREADY_EXIST,
        resultMessage: 'User already exists',
      };
    }

    const salt = generateSalt();
    const hash = generateHash(formData.password, salt);

    await db.user.create({
      data: {
        username: formData.username,
        password: hash,
        salt,
      },
    });

    redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
  } catch (error) {
    return {
      data: null,
      resultCode: RESULT_CODE.FAIL,
      resultMessage: 'Failed to create user',
    };
  }
};
