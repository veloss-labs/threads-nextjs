import NextAuth from 'next-auth';
import { authConfig } from '~/server/auth/options';

export default NextAuth(authConfig);
