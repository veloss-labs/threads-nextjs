'server-only';
import * as z from 'zod';

export const authFormSchema = z.object({
  username: z.string().min(1, '유저명은 1글자 이상이어야 합니다.'),
  password: z.string().min(6, '비밀번호는 6글자 이상이어야 합니다.'),
});

export const authResultSchema = z
  .object({
    ok: z.boolean(),
    resultCode: z.number().int().min(200).max(500),
    resultMessage: z.string().nullable(),
    data: z.unknown().nullable(),
    errors: z.any(),
  })
  .nullable();

export type AuthFormData = z.infer<typeof authFormSchema>;

export type AuthResult = z.infer<typeof authResultSchema>;
