import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { AsyncLocalStorage } from 'async_hooks';
import type { GetRequestStorage } from '~/@trpc/next-layout/server';
import type { AnyRouter } from '@trpc/server';
import type { SessionUser } from './options';

const asyncStorage: AsyncLocalStorage<GetRequestStorage<AnyRouter>> =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('next/dist/client/components/request-async-storage').requestAsyncStorage;

asyncStorage.getStore();

export async function getSession(): Promise<SessionUser | null> {
  const newCookies = cookies()
    .getAll()
    .reduce((cookiesObj, cookie) => {
      cookiesObj[cookie.name] = cookie.value;
      return cookiesObj;
    }, {} as Record<string, string>);

  const token = await getToken({
    req: {
      cookies: newCookies,
      headers: {},
    } as any,
  });

  if (!token) {
    return null;
  }

  // TODO: add more fields
  return token as SessionUser;
}
