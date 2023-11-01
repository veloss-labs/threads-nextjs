import { NextResponse } from 'next/server';
import { getSession } from '~/server/auth';
import { searchService } from '~/services/search/search.server';
import * as z from 'zod';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const searchParamsSchema = z.object({
  cursor: z.string().optional(),
  pageNo: z.number().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
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
      pageNo: searchParams.get('pageNo') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      q: searchParams.get('q') ?? undefined,
    });

    const data = await searchService.getSearch(query);
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

      const defaultValues = searchService.getDefaultItems();
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

      const defaultValues = searchService.getDefaultItems();
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
