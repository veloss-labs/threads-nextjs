'server-only';

import { Prisma } from '@prisma/client';

export const getAuthCredentialsSelector = () =>
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
