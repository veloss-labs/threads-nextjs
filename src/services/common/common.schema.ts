'server-only';

import * as z from 'zod';

export const resultSchema = z
  .object({
    ok: z.boolean(),
    resultCode: z.number().int().min(200).max(500),
    resultMessage: z.string().nullable(),
    data: z.unknown().nullable(),
    errors: z.any(),
  })
  .nullable();

export type ResultSchema = z.infer<typeof resultSchema>;
