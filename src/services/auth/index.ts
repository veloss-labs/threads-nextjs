'server-only';
import NextAuth, { type User } from 'next-auth';
import { type DefaultJWT } from 'next-auth/jwt';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { env } from '~/app/env';
import { userService } from '~/services/users/users.service';
import { authFormSchema } from '~/services/users/users.input';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  Prisma,
  type User as UserSchema,
  type UserProfile as UserProfileSchema,
} from '@prisma/client';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { NextResponse } from 'next/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string | null;
      profile: Omit<UserProfileSchema, 'bio'> | null;
    } & Omit<User, 'id'>;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    sub: string;
    user: Pick<UserSchema, 'id' | 'username' | 'name' | 'image' | 'email'> & {
      profile?: Omit<UserProfileSchema, 'bio'>;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  basePath: '/api/auth',
  adapter: PrismaAdapter(Prisma),
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
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
        const input = authFormSchema.safeParse(credentials);
        if (!input.success) {
          return null;
        }

        try {
          return await userService.getAuthCredentials(input.data);
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
    session: ({ session, token }) => {
      session.user = {
        ...session.user,
        id: token.sub,
        username: token?.user?.username,
        profile: token?.user?.profile ?? null,
      };
      return session;
    },
    authorized({ auth, request }) {
      const url = request.nextUrl;

      const authPath: string[] = [
        PAGE_ENDPOINTS.AUTH.SIGNIN,
        PAGE_ENDPOINTS.AUTH.SIGNUP,
      ];

      if (authPath.includes(url.pathname) && !!auth?.user) {
        return NextResponse.redirect(new URL(PAGE_ENDPOINTS.ROOT, url));
      }

      return !!auth?.user;
    },
  },
});
