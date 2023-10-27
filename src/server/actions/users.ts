'use server';
import { redirect } from 'next/navigation';
import { db } from '~/server/db/prisma';
import { generateHash, generateSalt } from '~/server/utils/password';
import {
  API_ENDPOINTS,
  PAGE_ENDPOINTS,
  RESULT_CODE,
} from '~/constants/constants';
import { generatorName } from '~/utils/utils';

type FormData = {
  username: string;
  password: string;
};

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export const createUser = async (formData: FormData): Promise<Result> => {
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

    const searchParams = new URLSearchParams();
    searchParams.append('seed', formData.username);
    const defaultImage = API_ENDPOINTS.avatar(searchParams);

    const name = generatorName(formData.username);

    await db.user.create({
      data: {
        name,
        username: formData.username,
        password: hash,
        salt,
        image: defaultImage,
        profile: {
          create: {
            bio: undefined,
          },
        },
      },
    });

    return {
      resultCode: RESULT_CODE.OK,
      resultMessage: null,
    };
  } catch (error) {
    console.error(error);
    return {
      resultCode: RESULT_CODE.FAIL,
      resultMessage: 'Failed to create user',
    };
  }
};
