import type { User, UserProfile } from '@prisma/client';

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type SearchItemSchema = Pick<
  User,
  'id' | 'name' | 'username' | 'email' | 'image'
> & {
  profile: Pick<UserProfile, 'bio'>;
};

export type SearchSchema = BasePaginationSchema & {
  list: SearchItemSchema[];
};
