import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import { createTRPCNextLayout } from '~/@trpc/next-layout/server';
import { createContextInner } from '~/server/api/context';

import { appRouter, type AppRouter } from '~/server/api/root';

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
export const api = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  // @ts-expect-error
  createContext() {
    return createContextInner({
      req: null,
    });
  },
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
