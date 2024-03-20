import * as z from 'zod';

export const createInputSchema = z.object({
  text: z.string().min(1).max(500),
  htmlJSON: z.string().optional(),
  hashTags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export type CreateInputSchema = z.infer<typeof createInputSchema>;

export const likeInputSchema = z.object({
  threadId: z.string(),
});

export type LikeInputSchema = z.infer<typeof likeInputSchema>;

export const idInputSchema = z.object({
  threadId: z.string(),
});

export type IdInputSchema = z.infer<typeof idInputSchema>;

export const updateInputSchema = z
  .object({
    whoCanLeaveComments: z
      .enum(['everyone', 'followers', 'mentiones', 'nobody'])
      .optional(),
    hiddenNumberOfLikesAndComments: z.boolean().optional(),
    text: z.string().min(1).max(500).optional(),
  })
  .extend(
    createInputSchema.omit({
      text: true,
    }).shape,
  )
  .extend(idInputSchema.shape);

export type UpdateInputSchema = z.infer<typeof updateInputSchema>;
