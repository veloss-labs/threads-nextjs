'server-only';
import { Prisma } from '@prisma/client';

export const AUTH_CRDENTIALS_USER_SELECT =
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
    password: true,
    salt: true,
    image: true,
    bio: true,
    onboarded: true,
    createdAt: true,
  });
