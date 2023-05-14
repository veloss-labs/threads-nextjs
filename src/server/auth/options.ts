import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import { env } from '~/env/server.mjs';
import { db } from '~/server/db/prisma';

import type { NextAuthOptions } from 'next-auth';
import type { User } from 'next-auth';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

export type SessionUser = User & {
  id: UserId;
};

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  // @ts-ignore
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore growing pains
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
};
