'server-only';
import type { NextAuthOptions as NextAuthConfig } from 'next-auth';
import { getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import { db } from '~/server/db/prisma';
import { userService } from '~/services/users/user.server';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    user: {
      id: string;
      name: string | undefined;
      username: string;
      email: string | undefined;
      emailVerified: boolean;
      image: string | undefined;
      profile: {
        bio: string | undefined;
      };
      isActive: boolean;
    };
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string | undefined;
      username: string;
      email: string | undefined;
      emailVerified: boolean;
      image: string | undefined;
      profile: {
        bio: string | undefined;
      };
    };
  }
}

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          return await userService.getAuthCredentials(credentials);
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin',
    error: '/signin', // Error code passed in query string as ?error=
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },
    session: async ({ session, token }) => {
      let isActive = false;
      if (token && token.sub) {
        const existingUser = await userService.getItem(token.sub);
        isActive = !!existingUser;
      }
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        username: token?.user?.username,
        emailVerified: token?.user?.emailVerified || false,
        profile: token?.user?.profile || {},
        isActive,
      };
      return session;
    },
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string | undefined;
      username: string;
      email: string | undefined;
      emailVerified: boolean;
      image: string | undefined;
      profile: {
        bio: string | undefined;
      };
      isActive: boolean;
    };
  } | null>;
}
