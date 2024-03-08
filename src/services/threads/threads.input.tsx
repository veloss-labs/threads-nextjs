import * as z from 'zod';

export const createInputSchema = z.object({
  text: z.string().min(1).max(500),
  htmlJSON: z.string().optional(),
  hashTags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export type CreateInputSchema = z.infer<typeof createInputSchema>;
