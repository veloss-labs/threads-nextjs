'use server';
import { redirect } from 'next/navigation';

import { db } from '~/server/db/prisma';
import { generateHash, generateSalt } from '~/server/utils/password';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';

type FormData = {
  username: string;
  password: string;
};

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export const createUser = async <State = any>(
  prevState: State,
  formData: FormData,
): Promise<Result> => {
  try {
    const exists = await db.user.findUnique({
      where: {
        username: formData.username,
      },
    });

    if (exists) {
      return {
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

    return redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
  } catch (error) {
    return {
      resultCode: RESULT_CODE.FAIL,
      resultMessage: 'Failed to create user',
    };
  }
};
