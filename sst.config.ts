import { SSTConfig } from 'sst';
import { modules } from './stacks/env';

export default {
  config() {
    return {
      name: modules.env.SST_NAME,
      region: modules.env.AWS_REGION,
      stage: modules.env.SST_STAGE,
    };
  },
  async stacks(application) {
    const appStacks = await import('./stacks');
    appStacks.default(application, modules.env);
  },
} satisfies SSTConfig;
