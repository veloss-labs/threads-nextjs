import 'dotenv/config';

// @ts-ignore
import type { Config } from 'drizzle-kit';
import { env } from '~/env/server.mjs';

const config: Config = {
  schema: './src/server/db/schema.ts',
  connectionString: env.DATABASE_URL,
};

export default config;
