'server-only';
import { Prisma, type User, type UserProfile } from '@prisma/client';

export const getUserSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
  });
};

export const getUserProfileSelector = () => {
  return Prisma.validator<Prisma.UserProfileSelect>()({
    bio: true,
  });
};

export const getUserSelector = (userId?: string) => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: getUserProfileSelector(),
    },
    followers: userId
      ? {
          where: {
            userId: userId,
          },
        }
      : false,
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
      select: getUserProfileSelector(),
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
  followers: UserSelectSchema[];
  _count: {
    followers: number;
    following: number;
  };
};
