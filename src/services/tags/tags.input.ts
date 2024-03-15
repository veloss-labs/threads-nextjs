import * as z from 'zod';

export const createInputSchema = z.object({
  name: z.string().min(1).max(50),
});

export type CreateInputSchema = z.infer<typeof createInputSchema>;
