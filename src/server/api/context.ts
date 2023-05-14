import { db } from '~/server/db/prisma';
import { getSession } from '~/server/auth/getSession';
import { getServerSession } from 'next-auth';
import { authConfig } from '~/server/auth/options';

import type { GetServerSidePropsContext } from 'next';
import type { NextRequest } from 'next/server';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { SessionUser } from '~/server/auth/options';

type CreateContextOptions = {
  req: NextRequest | GetServerSidePropsContext['req'] | null;
  session: SessionUser | null;
};

type CreateContextApiOptions = CreateNextContextOptions & {
  type: 'api';
};

type CreateContextRscOptions = {
  type: 'rsc';
  getSession: typeof getSession;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    db,
    req: opts.req,
    session: opts.session,
  };
};

export const createContext = async (
  opts: CreateContextApiOptions | CreateContextRscOptions,
) => {
  if (opts.type === 'rsc') {
    const session = await opts.getSession();
    return createContextInner({
      req: null,
      session,
    });
  }
  const session = await getServerSession(opts.req, opts.res, authConfig);
  return createContextInner({
    req: opts.req,
    session: session?.user ?? null,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
