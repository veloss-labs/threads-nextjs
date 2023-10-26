'use server';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/server/auth';
import { db } from '~/server/db/prisma';
import { revalidatePath } from 'next/cache';

type FormData = {
  text: string;
};

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export const createThreads = async <State = any>(
  prevState: State,
  formData: FormData,
): Promise<Result | undefined> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        resultCode: RESULT_CODE.LOGIN_REQUIRED,
        resultMessage: 'Login required',
      };
    }

    const { id } = session.user;

    await db.thread.create({
      data: {
        userId: id,
        text: formData.text,
      },
    });

    revalidatePath(PAGE_ENDPOINTS.ROOT);
  } catch (error) {
    return {
      resultCode: RESULT_CODE.FAIL,
      resultMessage: 'Failed to create threads',
    };
  }
};
