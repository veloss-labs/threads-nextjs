'use server';

import { revalidatePath } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/server/auth';
import { db } from '~/server/db/prisma';

type FormData = {
  text: string;
};

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

export const createThreads = async (formData: FormData): Promise<Result> => {
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

    return redirect(PAGE_ENDPOINTS.ROOT, RedirectType.replace);
  } catch (error) {
    console.log('error', error);
    return {
      resultCode: RESULT_CODE.FAIL,
      resultMessage: 'Failed to create threads',
    };
  }
};
