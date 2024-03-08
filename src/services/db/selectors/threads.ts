'server-only';
import { Prisma, type Thread } from '@prisma/client';
import { type UserSelectSchema, getUserSelector } from './users';
import { type ThreadListQuerySchema } from '~/services/threads/threads.query';

export const getThreadsSelector = (input?: ThreadListQuerySchema) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    level: true,
    createdAt: true,
    whoCanLeaveComments: true,
    hiddenNumberOfLikesAndComments: true,
    deleted: true,
    user: {
      select: getUserSelector(),
    },
  });

export type ThreadSelectSchema = Pick<
  Thread,
  | 'id'
  | 'text'
  | 'level'
  | 'createdAt'
  | 'deleted'
  | 'hiddenNumberOfLikesAndComments'
  | 'whoCanLeaveComments'
> & {
  user: UserSelectSchema;
};
