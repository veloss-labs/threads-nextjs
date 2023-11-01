'server-only';
import { Prisma } from '@prisma/client';

export const SEARCH_SELECT = Prisma.validator<Prisma.UserSelect>()({
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
});
