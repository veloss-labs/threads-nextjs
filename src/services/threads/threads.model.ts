import type { Thread, User } from '@prisma/client';

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

export type ThreadRawQuerySchema = {
  id: string;
  type: string;
  text: string;
  level: number;
  deleted: boolean;
  created_at: string;
  is_liked?: number;
  is_commented?: number;
  is_reposted?: number;
  likes: number;
  comments: number;
  reposts: number;
  user_id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  user_profiles_bio: string | null;
  recent_likes: string;
  recent_comments: string;
  recent_reposts: string;
};

export type BasePaginationSchema = {
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};

export type ThreadItemSchema = Pick<
  Thread,
  'id' | 'deleted' | 'text' | 'level' | 'type' | 'createdAt'
> & {
  user: Pick<User, 'id' | 'name' | 'username' | 'email' | 'image'> & {
    profile: { bio: string | null };
  };
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
  recent: {
    likes: Record<string, string>[];
    comments: Record<string, string>[];
    reposts: Record<string, string>[];
  };
  count: {
    likes: number;
    comments: number;
    reposts: number;
  };
};

export type ThreadSchema = BasePaginationSchema & {
  list: ThreadItemSchema[];
};
