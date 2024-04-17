'server-only';
import NextAuth, { type User } from 'next-auth';
import { type DefaultJWT } from 'next-auth/jwt';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { env } from '~/app/env';
import { userService } from '~/services/users/users.service';
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
      username: string;
      profile: Pick<UserProfileSchema, 'bio' | 'website'> | null;
    } & Omit<User, 'id'>;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    sub: string;
    user: Pick<UserSchema, 'id' | 'username' | 'name' | 'image' | 'email'> & {
      profile?: Pick<UserProfileSchema, 'bio' | 'website'>;
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
        return await userService.authorize(credentials);
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
    newUser: '/signup',
    error: '/signin', // Error code passed in query string as ?error=
    signOut: '/signin',
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

      const isLoggedIn = !!auth?.user;

      const authPath: string[] = [
        PAGE_ENDPOINTS.AUTH.SIGNIN,
        PAGE_ENDPOINTS.AUTH.SIGNUP,
      ];

      const isAuthPath = authPath.includes(url.pathname);

      // 인증 페이지인 데 로그인을 안한 경우 그대로 진행
      if (authPath.includes(url.pathname) && !isLoggedIn) {
        return true;
      }

      // 인증 페이지인데 로그인을 한 경우 루트로 리다이렉트
      if (isAuthPath && isLoggedIn) {
        return NextResponse.redirect(new URL(PAGE_ENDPOINTS.ROOT, url));
      }

      return isLoggedIn;
    },
  },
});
