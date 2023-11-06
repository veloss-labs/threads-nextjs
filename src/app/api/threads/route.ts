import { NextResponse } from 'next/server';
import { getSession } from '~/server/auth';
import { threadService } from '~/services/threads/threads.server';
import * as z from 'zod';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const searchParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().optional(),
  deleted: z.boolean().optional().default(false),
  type: z.enum(['repost', 'comment', 'thread']).optional().default('thread'),
  userId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response('Unauthorized', { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const query = await searchParamsSchema.parseAsync({
      cursor: searchParams.get('cursor') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      deleted: searchParams.get('deleted') ?? undefined,
      userId: searchParams.get('userId') ?? undefined,
      type: searchParams.get('type') ?? undefined,
    });

    console.log('[threads request url] ====>', request.url);
    console.log('[threads query] ====>', query);

    const data = await threadService.getItems(query, session.user.id);
    return NextResponse.json({
      ...data,
      error: null,
    });
  } catch (error) {
    console.log('error', error);
    if (error instanceof z.ZodError) {
      const err = {
        code: 'invalid_query_params',
        message: 'Invalid query params',
        errors: error.issues,
      };

      const defaultValues = threadService.getDefaultItems();
      return NextResponse.json(
        {
          ...defaultValues,
          error: err,
        },
        { status: 400 },
      );
    }

    if (error instanceof PrismaClientValidationError) {
      const err = {
        code: 'database_validation_error',
        message: 'Database validation error',
        errors: [],
      };

      const defaultValues = threadService.getDefaultItems();
      return NextResponse.json(
        {
          ...defaultValues,
          error: err,
        },
        { status: 400 },
      );
    }

    return new Response(null, { status: 500 });
  }
}
