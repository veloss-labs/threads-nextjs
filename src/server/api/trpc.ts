import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zod:
          error.cause instanceof ZodError
            ? error.cause.flatten().fieldErrors
            : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next, ...args }) => {
  if (!ctx.session || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
