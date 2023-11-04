'use server';

import { RESULT_CODE } from '~/constants/constants';
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

type RepostFormData = {
  threadId: string;
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

export const repostThread = async (
  formData: RepostFormData,
): Promise<Result> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        resultCode: RESULT_CODE.LOGIN_REQUIRED,
        resultMessage: 'Login required',
      };
    }

    const thread = await threadService.getItemsById(formData.threadId);
    if (!thread) {
      return {
        resultCode: RESULT_CODE.NOT_EXIST,
        resultMessage: 'Not found',
      };
    }

    if (thread.hasReposts) {
      return {
        resultCode: RESULT_CODE.INVALID,
        resultMessage: 'Invalid',
      };
    }

    const { id } = session.user;

    await threadService.createItme({
      userId: id,
      text: thread.text,
      repostId: thread.id,
    });

    await threadService.updateItem(formData.threadId, {
      hasReposts: true,
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

export const unrepostThread = async (
  formData: RepostFormData,
): Promise<Result> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        resultCode: RESULT_CODE.LOGIN_REQUIRED,
        resultMessage: 'Login required',
      };
    }

    const thread = await threadService.getItemsById(formData.threadId);
    if (!thread) {
      return {
        resultCode: RESULT_CODE.NOT_EXIST,
        resultMessage: 'Not found',
      };
    }

    if (!thread.hasReposts) {
      return {
        resultCode: RESULT_CODE.INVALID,
        resultMessage: 'Invalid',
      };
    }

    await threadService.updateItem(thread.id, {
      hasReposts: false,
      repostId: null,
    });

    await threadService.deleteRepost(thread.id);

    return {
      resultCode: RESULT_CODE.OK,
      resultMessage: null,
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
