'server-only';

import { Prisma } from '@prisma/client';

import type { Tag } from '@prisma/client';

export const getTagsSimpleSelector = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
  });
};

export const getTagsSelector = () =>
  Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
  });

export type TagSelectSchema = Pick<Tag, 'id' | 'name' | 'createdAt'>;
