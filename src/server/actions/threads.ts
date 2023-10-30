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

    return {
      resultCode: RESULT_CODE.OK,
      resultMessage: null,
    };
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const createThreadsWithRedirect = async (
  prevState: Result,
  formData: FormData,
): Promise<Result> => {
  await createThreads(formData);
  revalidatePath(PAGE_ENDPOINTS.ROOT);
  redirect(PAGE_ENDPOINTS.ROOT, RedirectType.replace);
};
