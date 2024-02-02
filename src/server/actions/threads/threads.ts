'use server';

import { RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/services/auth';
import { threadService } from '~/services/threads/threads.server';

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

type CreateFormData = {
  text: string;
  revalidatePath?: string;
};

export const createThreadAction = async (
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
