import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    SITE_URL: z.string().min(1).default('http://localhost:3000'),
    API_PREFIX: z.string().min(1).default('/api'),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
  },
  server: {
    AUTH_SECRET: z.string().min(1),
    DATABASE_URL:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    // server
    NODE_ENV: process.env.NODE_ENV,
    DEPLOY_GROUP: process.env.DEPLOY_GROUP,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    // client
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
  },
});
