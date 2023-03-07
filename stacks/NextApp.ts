import { NextjsSite, StackContext } from 'sst/constructs';

export function NextApp({ stack }: StackContext) {
  const NEXT_APP_PATH = '.';
  const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET;
  const AWS_SST_ID = process.env.AWS_SST_ID;

  if (!S3_BUCKET_NAME || !AWS_SST_ID) {
    const error = new Error();
    error.name = 'MissingEnvVars';
    error.message = 'Missing "AWS_S3_BUCKET" or "AWS_SST_ID"';
    throw error;
  }

  const site = new NextjsSite(stack, AWS_SST_ID, {
    path: NEXT_APP_PATH,
    memorySize: 1024,
    timeout: 30,
    cdk: {
      bucket: {
        bucketName: S3_BUCKET_NAME,
      },
    },
  });

  stack.addOutputs({
    url: site.url ?? 'undefined',
    bucketName: site.cdk?.bucket.bucketName ?? 'undefined',
    distributionId: site.cdk?.distribution.distributionId ?? 'undefined',
  });

  return {
    site,
  };
}
