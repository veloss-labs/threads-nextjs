'server-only';
import * as z from 'zod';

export const cursorPaginationQuerySchema = z.object({
  limit: z.number().optional().default(30),
  cursor: z.string().optional(),
});

export const listQuerySchema = z
  .object({
    keyword: z.string().optional(),
  })
  .merge(cursorPaginationQuerySchema)
  .optional();

export type UserListQuerySchema = z.infer<typeof listQuerySchema>;
