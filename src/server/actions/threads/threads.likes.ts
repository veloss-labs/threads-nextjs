'use server';
import { RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/server/auth';
import { threadService } from '~/services/threads/threads.server';

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

type LikeFormData = {
  threadId: string;
  isLike: boolean;
  revalidatePath?: string;
};

type LikeResult = Result & {
  data: number | null;
};

export const likeThreadAction = async (
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
