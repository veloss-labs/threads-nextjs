import type { Thread } from '@prisma/client';

export type ThreadSelectSchema = Omit<
  Thread,
  'userId' | 'updatedAt' | 'assets' | 'user' | 'likes'
> & {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    image: string | null;
    profile: {
      bio: string | null;
    } | null;
  };
  likes: { id: string }[];
  _count: {
    likes: number;
  };
};

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ThreadItemSchema = Omit<ThreadSelectSchema, 'likes'> & {
  isLiked: boolean;
};

export type ThreadSchema = BasePaginationSchema & {
  list: ThreadItemSchema[];
};
