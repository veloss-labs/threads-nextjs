'server-only';
import { Prisma, type Tag } from '@prisma/client';

export const getTagsSelector = () =>
  Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    createdAt: true,
    _count: {
      select: {
        followTags: true,
      },
    },
  });

export type TagSelectSchema = Pick<Tag, 'id' | 'name' | 'createdAt'> & {
  _count: {
    followTags: number;
  };
};
