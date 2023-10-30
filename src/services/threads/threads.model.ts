import type { Thread, User } from '@prisma/client';

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ThreadItemSchema = Thread & {
  user: User;
};

export type ThreadSchema = BasePaginationSchema & {
  list: ThreadItemSchema[];
};
