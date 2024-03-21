'server-only';
import * as z from 'zod';

export const authFormSchema = z.object({
  username: z.string().min(1, '유저명은 1글자 이상이어야 합니다.'),
  password: z.string().min(6, '비밀번호는 6글자 이상이어야 합니다.'),
});

export type AuthFormData = z.infer<typeof authFormSchema>;

export const userIdSchema = z.object({
  userId: z.string(),
});

export type UserIdInput = z.infer<typeof userIdSchema>;

export const followUserSchema = z.object({
  targetId: z.string(),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;
