'server-only';

import * as z from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, '유저명은 1글자 이상이어야 합니다.'),
  password: z.string().min(6, '비밀번호는 6글자 이상이어야 합니다.'),
});

export type SignInInputSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(6, '비밀번호는 6글자 이상이어야 합니다.'),
  })
  .merge(signInSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignUpInputSchema = z.infer<typeof signUpSchema>;

export const userIdSchema = z.object({
  userId: z.string(),
});

export type UserIdInput = z.infer<typeof userIdSchema>;

export const followUserSchema = z.object({
  targetId: z.string(),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;

export const updateProfileSchema = z.object({
  name: z.string().max(50, '이름은 50글자 이하이어야 합니다.'),
  bio: z.string().max(100, '자기소개는 100글자 이하이어야 합니다.').optional(),
  website: z.string().url().optional(),
});

export type UpdateProfileInputSchema = z.infer<typeof updateProfileSchema>;
