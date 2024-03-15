import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

export const env = createEnv({
  shared: {
    SITE_URL: z.string().min(1).default('http://localhost:3000'),
    API_PREFIX: z.string().min(1).default('/api'),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
  },
  server: {
    AUTH_SECRET: z.string().min(1),
    DATABASE_URL: isProduction ? z.string().min(1) : z.string().optional(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    // deployment for sst
    SST_NAME: z.string().min(1),
    SST_ID: isProduction ? z.string().min(1) : z.string().optional(),
    SST_STAGE: isProduction
      ? z.enum(['dev', 'staging', 'prod', 'local'])
      : z.enum(['dev', 'staging', 'prod', 'local']).optional(),
    AWS_REGION: isProduction ? z.string().min(1) : z.string().optional(),
    AWS_ACCESS_KEY_ID: isProduction ? z.string().min(1) : z.string().optional(),
    AWS_SECRET_ACCESS_KEY: isProduction
      ? z.string().min(1)
      : z.string().optional(),
    AWS_S3_BUCKET: isProduction ? z.string().min(1) : z.string().optional(),
    AWS_CLOUD_FRONT_DISTRIBUTION_ID: z.string().optional(),
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
    // deployment for sst
    SST_NAME: process.env.SST_NAME,
    SST_ID: process.env.SST_ID,
    SST_STAGE: process.env.SST_STAGE,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_CLOUD_FRONT_DISTRIBUTION_ID:
      process.env.AWS_CLOUD_FRONT_DISTRIBUTION_ID,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === 'lint',
});
