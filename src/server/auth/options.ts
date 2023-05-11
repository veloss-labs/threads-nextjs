import { createDrizzleAdapter } from '~/server/auth/adapters/drizzle-orm';
import { db } from '~/server/db/drizzle-db';
import { type SolidAuthConfig } from './server';
import GithubProvider from '@auth/core/providers/github';
import { env } from '~/env/server.mjs';

export type { DefaultSession, Session } from '@auth/core/types';

/**
 * Module augmentation for `@auth/core/types` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: SolidAuthConfig = {
  adapter: createDrizzleAdapter(db),
  providers: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore growing pains
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
};
