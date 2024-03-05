import * as z from 'zod';

export const createInputSchema = z.object({
  text: z.string().min(1).max(500),
});

export const resultSchema = z
  .object({
    ok: z.boolean(),
    resultCode: z.number().int().min(200).max(500),
    resultMessage: z.string().nullable(),
    data: z.unknown().nullable(),
    errors: z.any(),
  })
  .nullable();

export type CreateInputSchema = z.infer<typeof createInputSchema>;
