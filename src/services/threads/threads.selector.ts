'server-only';
import { Prisma } from '@prisma/client';

export const THREADS_SELECT = (currentUserId?: string) =>
  Prisma.validator<Prisma.ThreadSelect>()({
    id: true,
    text: true,
    hasChildren: true,
    hasReposts: true,
    parentId: true,
    repostId: true,
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
    _count: {
      select: {
        likes: true,
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
