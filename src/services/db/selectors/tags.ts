'server-only';
import { Prisma, type Tag } from '@prisma/client';

export const getTagsSelector = () =>
  Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
  });

export type TagSelectSchema = Pick<Tag, 'id' | 'name' | 'createdAt'>;
