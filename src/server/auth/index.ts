import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions as NextAuthConfig } from 'next-auth';
import { getServerSession } from 'next-auth';

import GitHub from 'next-auth/providers/github';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
  }
}

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
} satisfies NextAuthConfig;

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
