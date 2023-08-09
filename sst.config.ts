import { SSTConfig } from 'sst';
import { NextApp } from './stacks/NextApp';

const AWS_SST_NAME = process.env.AWS_SST_NAME;
const AWS_SST_STAGE = process.env.AWS_SST_STAGE;
const AWS_REGION = process.env.AWS_REGION;

export default {
  config() {
    return {
      name: AWS_SST_NAME,
      region: AWS_REGION,
      stage: AWS_SST_STAGE,
    };
  },
  stacks(app) {
    app.stack(NextApp);
  },
} satisfies SSTConfig;
