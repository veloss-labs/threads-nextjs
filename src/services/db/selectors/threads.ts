'server-only';
import { Prisma, type Thread } from '@prisma/client';
import { type UserSelectSchema, getUserSelector } from './users';
import { type ThreadListQuerySchema } from '~/services/threads/threads.query';

export const getThreadsSelector = (input?: ThreadListQuerySchema) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    type: true,
    text: true,
    level: true,
    createdAt: true,
    user: {
      select: getUserSelector(),
    },
  });

export type ThreadSelectSchema = Pick<
  Thread,
  'id' | 'type' | 'text' | 'level' | 'createdAt'
> & {
  user: UserSelectSchema;
};
