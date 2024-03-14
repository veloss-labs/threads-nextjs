'server-only';
import { Prisma, type User, type UserProfile } from '@prisma/client';

export const getUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: {
        bio: true,
      },
    },
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  });
};

export const getFollowWithUserSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: {
        bio: true,
      },
    },
    followers: {
      select: getUserSelector(),
    },
    following: {
      select: getUserSelector(),
    },
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  });
};

export type UserSelectSchema = Pick<
  User,
  'id' | 'name' | 'username' | 'email' | 'image' | 'emailVerified'
> & {
  profile: Pick<UserProfile, 'bio'> | null;
};
