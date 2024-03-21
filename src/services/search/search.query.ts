'server-only';
import * as z from 'zod';

export const cursorPaginationQuerySchema = z.object({
  limit: z.number().optional().default(30),
  cursor: z.string().optional(),
});

export const querySchema = z.object({
  keyword: z.string().optional(),
  searchType: z
    .enum(['default', 'tags', 'mentions'])
    .default('default')
    .optional(),
  tagId: z.string().optional(),
  userId: z.string().optional(),
});

export const searchQuerySchema = z
  .object(querySchema.shape)
  .merge(cursorPaginationQuerySchema)
  .optional();

export type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

export const searchUsersQuerySchema = z
  .object(
    querySchema.pick({
      keyword: true,
    }).shape,
  )
  .optional();

export type SearchUsersQuerySchema = z.infer<typeof searchUsersQuerySchema>;
