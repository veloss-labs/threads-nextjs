'server-only';
import { Prisma } from '@prisma/client';

export const THREADS_SELECT = (currentUserId?: string) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    type: true,
    text: true,
    level: true,
    deleted: true,
    createdAt: true,
    likes: {
      select: {
        id: true,
      },
      where: {
        userId: {
          in: currentUserId ? [currentUserId] : [],
        },
      },
    },
    comments: {
      select: {
        id: true,
        commentId: true,
      },
      where: {
        comment: {
          userId: {
            in: currentUserId ? [currentUserId] : [],
          },
        },
      },
    },
    reposts: {
      select: {
        id: true,
        threadId: true,
      },
      where: {
        repost: {
          userId: {
            in: currentUserId ? [currentUserId] : [],
          },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
        reposts: true,
      },
    },
    user: {
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        profile: {
          select: {
            bio: true,
          },
        },
      },
    },
  });

export const THREADS_REPOST_SELECT = (currentUserId?: string) =>
  Prisma.validator<Prisma.ThreadRepostSelect>()({
    id: true,
    threadId: true,
    repost: {
      select: THREADS_SELECT(currentUserId),
    },
  });

export const THREADS_COMMENT_SELECT = (currentUserId?: string) =>
  Prisma.validator<Prisma.ThreadCommentSelect>()({
    id: true,
    threadId: true,
    comment: {
      select: THREADS_SELECT(currentUserId),
    },
  });
