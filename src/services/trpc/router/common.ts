import z from 'zod';
import { revalidatePath } from 'next/cache';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';

export const commonRouter = createTRPCRouter({
  revalidatePath: protectedProcedure
    .input(
      z.object({
        originalPath: z.string(),
        type: z.enum(['layout', 'page']).optional(),
      }),
    )
    .query(({ input }) => {
      revalidatePath(input.originalPath, input.type);
      return {
        revalidated: true,
        now: Date.now(),
      };
    }),
});
