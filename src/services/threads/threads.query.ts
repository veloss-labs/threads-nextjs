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

export const bookmarkListQuerySchema = cursorPaginationQuerySchema.optional();

export type BookmarkListQuerySchema = z.infer<typeof bookmarkListQuerySchema>;

export const recommendationListQuerySchema =
  cursorPaginationQuerySchema.optional();

export type RecommendationListQuerySchema = z.infer<
  typeof recommendationListQuerySchema
>;

export const followListQuerySchema = cursorPaginationQuerySchema.optional();

export type FollowListQuerySchema = z.infer<typeof followListQuerySchema>;

export const repostListQuerySchema = z
  .object({
    userId: z.string(),
  })
  .merge(cursorPaginationQuerySchema);

export type RepostListQuerySchema = z.infer<typeof repostListQuerySchema>;

export const listQuerySchema = z
  .object({
    keyword: z.string().optional(),
    userId: z.string().optional(),
    type: z
      .enum(['user', 'repost', 'comment', 'follow', 'default'])
      .default('default')
      .optional(),
  })
  .merge(cursorPaginationQuerySchema);

export type ThreadListQuerySchema = z.infer<typeof listQuerySchema>;
