import { NextResponse } from 'next/server';
import { auth } from '~/services/auth';
import { threadService } from '~/services/threads/threads.server';
import * as z from 'zod';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const searchParamsSchema = z.object({
  cursor: z.string().optional(),
  pageNo: z.number().optional(),
  limit: z.string().optional(),
  deleted: z.boolean().optional().default(false),
  hasParent: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  hasRepost: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response('Unauthorized', { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const query = await searchParamsSchema.parseAsync({
      cursor: searchParams.get('cursor') ?? undefined,
      pageNo: searchParams.get('pageNo') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      deleted: searchParams.get('deleted') ?? undefined,
      hasParent: searchParams.get('hasParent') ?? undefined,
      hasRepost: searchParams.get('hasRepost') ?? undefined,
    });

    const data = await threadService.getLikes(session.user.id, query);
    return NextResponse.json({
      ...data,
      error: null,
    });
  } catch (error) {
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
