'server-only';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { env } from 'env.mjs';
import { userService } from '~/services/users/users.service';
import { authFormSchema } from '~/services/users/users.input';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Prisma } from '@prisma/client';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { NextResponse } from 'next/server';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.NEXTAUTH_SECRET,
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
    async jwt({ token, user, ...rest }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },
    // @ts-expect-error - This is a valid callback
    session: ({ session, token, ...opts }) => {
      // console.log('session', { session, token, opts });
      session.user = {
        ...session.user,
        id: token.sub,
        // @ts-expect-error - This is a valid callback
        username: token?.user?.username,
        emailVerified: token?.user?.emailVerified || false,
        profile: token?.user?.profile || {},
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
