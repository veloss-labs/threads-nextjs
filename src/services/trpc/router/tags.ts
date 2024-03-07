import { createInputSchema } from '~/services/tags/tags.input';
import { tagService } from '~/services/tags/tags.service';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/services/trpc/core/trpc';
import { searchQuerySchema } from '~/services/users/users.query';

export const tagsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        const tags = await tagService.create(userId, input);
        return tags;
      } catch (error) {
        console.log('error', error);
        return [];
      }
    }),
  getMentionTags: protectedProcedure
    .input(searchQuerySchema)
    .query(async ({ input }) => {
      try {
        if (!input.keyword) {
          return [];
        }

        return await tagService.getMentionTags(input.keyword);
      } catch (error) {
        console.log('error', error);
        return [];
      }
    }),
});
