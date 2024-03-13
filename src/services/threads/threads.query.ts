'server-only';
import * as z from 'zod';

export const cursorPaginationQuerySchema = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().optional(),
});

export type CursorPaginationQuerySchema = z.infer<
  typeof cursorPaginationQuerySchema
>;

export const likeListQuerySchema = cursorPaginationQuerySchema.optional();

export type LikeListQuerySchema = z.infer<typeof likeListQuerySchema>;

export const listQuerySchema = z
  .object({
    keyword: z.string().optional(),
    userId: z.string().optional(),
    type: z
      .enum(['recommendation', 'user', 'repost', 'comment', 'follow'])
      .default('recommendation')
      .optional(),
  })
  .merge(cursorPaginationQuerySchema);

export type ThreadListQuerySchema = z.infer<typeof listQuerySchema>;
