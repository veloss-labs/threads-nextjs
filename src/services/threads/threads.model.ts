import type { Thread } from '@prisma/client';

export type ThreadSelectSchema = Omit<
  Thread,
  | 'userId'
  | 'updatedAt'
  | 'assets'
  | 'user'
  | 'likes'
  | 'comments'
  | 'reposts'
  | 'hasReposts'
  | 'hasComments'
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
  comments: { id: string; commentId: string }[];
  reposts: { id: string; threadId: string }[];
  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };
};

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ThreadItemSchema = Omit<
  ThreadSelectSchema,
  'likes' | 'comments' | 'reposts'
> & {
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
};

export type ThreadSchema = BasePaginationSchema & {
  list: ThreadItemSchema[];
};
