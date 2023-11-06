'use server';

import { RESULT_CODE } from '~/constants/constants';
import { getSession } from '~/server/auth';
import { threadService } from '~/services/threads/threads.server';

type Result = {
  resultCode: number;
  resultMessage: string | null;
};

type RepostFormData = {
  threadId: string;
  revalidatePath?: string;
};

export const repostThreadAction = async (
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

    const data = await threadService.getItemsById(formData.threadId);
    if (!data) {
      return {
        resultCode: RESULT_CODE.NOT_EXIST,
        resultMessage: 'Not found',
      };
    }

    const { id } = session.user;

    const alreadyReposted = await threadService.getItemRepostsById(
      formData.threadId,
    );

    if (alreadyReposted) {
      await threadService.deleteItems(alreadyReposted.repost.id);
      return {
        resultCode: RESULT_CODE.OK,
        resultMessage: null,
      };
    }

    const newData = await threadService.createItme({
      userId: id,
      type: 'repost',
      text: data.text,
    });

    await threadService.createRepost({
      threadId: formData.threadId,
      repostId: newData.id,
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
