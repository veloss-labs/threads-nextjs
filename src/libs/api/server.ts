import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import { createTRPCNextLayout } from '~/@trpc/next-layout/server';
import { createContext as ctx } from '~/server/api/context';

import { appRouter, type AppRouter } from '~/server/api/root';
import { getSession } from '~/server/auth/getSession';

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
export const api = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  createContext() {
    return ctx({
      type: 'rsc',
      getSession,
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
