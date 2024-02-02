'server-only';
import { Prisma } from '@prisma/client';

export const AUTH_CRDENTIALS_USER_SELECT =
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    username: true,
    password: true,
    salt: true,
    email: true,
    image: true,
    emailVerified: true,
    profile: {
      select: {
        bio: true,
      },
    },
  });

export const USER_SELECT = Prisma.validator<Prisma.UserSelect>()({
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
});
