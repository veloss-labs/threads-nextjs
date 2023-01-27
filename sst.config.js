import { NextApp } from './stacks/NextApp';

const AWS_SST_NAME = process.env.AWS_SST_NAME;
const AWS_SST_STAGE = process.env.AWS_SST_STAGE;
const AWS_REGION = process.env.AWS_REGION;

const DEFAULT_NODEJS_RUNTIME = 'nodejs16.x';
const DEFAULT_FUNCTION_NAME = 'sst-nextjs-function';

/**
 * SST Config Options
 * @type {import('sst').SSTConfig} */
export default {
  config() {
    return {
      name: AWS_SST_NAME,
      region: AWS_REGION,
      stage: AWS_SST_STAGE,
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: DEFAULT_NODEJS_RUNTIME,
      functionName: DEFAULT_FUNCTION_NAME,
      bundle: {
        format: 'esm',
      },
    });
    app.stack(NextApp);
  },
};
