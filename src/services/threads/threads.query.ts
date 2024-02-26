'server-only';
import * as z from 'zod';

export const cursorPaginationQuerySchema = z.object({
  limit: z.number().optional().default(30),
  cursor: z.string().optional(),
});

export const listQuerySchema = z
  .object({
    keyword: z.string().optional(),
    userId: z.string().optional(),
  })
  .merge(cursorPaginationQuerySchema)
  .optional();

export type ThreadListQuerySchema = z.infer<typeof listQuerySchema>;

export type BaseThreadQuery = {
  limit?: number | string;
  pageNo?: number | string;
  cursor?: string;
};

export type ThreadQuery = BaseThreadQuery & {
  deleted?: boolean;
  userId?: string;
  type?: 'repost' | 'comment' | 'thread' | 'like';
};

export type SearchThreadQuery = BaseThreadQuery & {
  q?: string;
};
