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
        versioned: true,
        bucketName: S3_BUCKET_NAME,
      },
    },
  });

  const { cdk } = site;

  const url = site.url || 'localhost';
  const bucketName = cdk?.bucket?.bucketName || 'undefined';
  const distributionId = cdk?.distribution?.distributionId || 'undefined';

  stack.addOutputs({
    url,
    bucketName,
    distributionId,
  });

  return {
    site,
  };
}
