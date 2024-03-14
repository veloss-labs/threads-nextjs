import { NextjsSite, Bucket, type StackContext, Cron } from 'sst/constructs';
import type { Module } from './env';

export function Web({ stack }: StackContext, env: Module['env']) {
  const bucket = new Bucket(stack, env.AWS_S3_BUCKET);

  const site = new NextjsSite(stack, env.SST_ID, {
    timeout: 30,
    memorySize: 1024,
    bind: [bucket],
    cdk: {
      distribution: {
        comment: `Nextjs distribution for ${env.SST_NAME} (${env.SST_STAGE})`,
      },
    },
  });

  new Cron(stack, 'daliy-recommendations', {
    schedule: 'rate(1 day)',
    job: {
      function: {
        bind: [bucket],
        handler: 'functions/daliy-recommendations.handler',
      },
    },
  });

  stack.addOutputs({
    Id: site.cdk?.distribution?.distributionId,
    SiteUrl: site.url,
  });
}
