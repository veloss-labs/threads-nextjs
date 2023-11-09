'use server';
import { redirect } from 'next/navigation';
import { generateHash, generateSalt } from '~/server/utils/password';
import {
  API_ENDPOINTS,
  PAGE_ENDPOINTS,
  RESULT_CODE,
} from '~/constants/constants';
import { generatorName } from '~/utils/utils';
import { revalidatePath } from 'next/cache';
import { userService } from '~/services/users/user.server';

type FormData = {
  username: string;
  password: string;
};

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export const createUserAction = async (formData: FormData): Promise<Result> => {
  try {
    const exists = await userService.getItemByUsername(formData.username);
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

    await userService.createItem({
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
    });

    return {
      resultCode: RESULT_CODE.OK,
      resultMessage: null,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUserWithRevalidateAction = async (
  prevState: Result,
  formData: FormData,
): Promise<Result> => {
  await createUserAction(formData);

  revalidatePath(PAGE_ENDPOINTS.ROOT);
  redirect(PAGE_ENDPOINTS.ROOT);
};
