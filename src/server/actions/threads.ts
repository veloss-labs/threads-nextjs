'use server';

import { revalidatePath } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';
import { PAGE_ENDPOINTS, RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/server/auth';
import { threadService } from '~/services/threads/threads.server';

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

type CreateFormData = {
  text: string;
  revalidatePath?: string;
};

type LikeFormData = {
  threadId: string;
  isLike: boolean;
  revalidatePath?: string;
};

type LikeResult = Result & {
  data: number | null;
};

export const likeThread = async (
  formData: LikeFormData,
): Promise<LikeResult> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        resultCode: RESULT_CODE.LOGIN_REQUIRED,
        resultMessage: 'Login required',
        data: null,
      };
    }

    const { id } = session.user;

    let count = 0;
    if (formData.isLike) {
      count = await threadService.unlikeItem(formData.threadId, id);
    } else {
      count = await threadService.likeItem(formData.threadId, id);
    }

    return {
      resultCode: RESULT_CODE.OK,
      resultMessage: null,
      data: count,
    };
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const createThreads = async (
  formData: CreateFormData,
): Promise<Result> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        resultCode: RESULT_CODE.LOGIN_REQUIRED,
        resultMessage: 'Login required',
      };
    }

    const { id } = session.user;

    await threadService.createItme({
      userId: id,
      text: formData.text,
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

export const likeThreadsWithRevalidate = async (
  prevState: Result,
  formData: LikeFormData,
) => {
  await likeThread(formData);
  if (formData.revalidatePath) {
    revalidatePath(formData.revalidatePath);
  } else {
    revalidatePath(PAGE_ENDPOINTS.ROOT);
  }
};

export const createThreadsWithRedirect = async (
  prevState: Result,
  formData: CreateFormData,
): Promise<Result> => {
  await createThreads(formData);
  if (formData.revalidatePath) {
    revalidatePath(formData.revalidatePath);
  } else {
    revalidatePath(PAGE_ENDPOINTS.ROOT);
  }
  redirect(PAGE_ENDPOINTS.ROOT, RedirectType.replace);
};
