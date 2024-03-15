import createJiti from 'jiti';
const jiti = createJiti(new URL(import.meta.url).pathname);

export type Module = {
  env: Readonly<{
    AUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    DATABASE_URL?: string | undefined;
    SITE_URL: string;
    API_PREFIX: string;
    NODE_ENV: 'development' | 'test' | 'production';
    DEPLOY_GROUP: 'development' | 'local' | 'production';
    SST_NAME: string;
    SST_ID: string;
    SST_STAGE: 'dev' | 'staging' | 'prod';
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
  }>;
};

// Import env here to validate during build. Using jiti we can import .ts files :)
const modules: Module = jiti('../src/app/env');

console.log(modules);

export { modules };
