import type { Thread, User, UserProfile } from '@prisma/client';

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ThreadItemSchema = Omit<Thread, 'userId' | 'updatedAt'> & {
  user: Pick<User, 'id' | 'name' | 'username' | 'email' | 'image'> & {
    profile: Pick<UserProfile, 'bio'>;
  };
};

export type ThreadSchema = BasePaginationSchema & {
  list: ThreadItemSchema[];
};
