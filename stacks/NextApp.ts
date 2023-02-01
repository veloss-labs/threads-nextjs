import { NextjsSite, StackContext } from 'sst/constructs';

export function NextApp({ stack }: StackContext) {
  const NEXT_APP_PATH = '.';
  const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET;
  const AWS_SST_ID = process.env.AWS_SST_ID || 'SST_NEXTJS_WEB';

  const site = new NextjsSite(stack, AWS_SST_ID, {
    path: NEXT_APP_PATH,
    memorySize: 1024,
    timeout: 30,
    cdk: {
      bucket: {
        bucketName: S3_BUCKET_NAME,
      },
      distribution: {},
    },
  });

  stack.addOutputs({
    url: site.url ?? 'undefined',
    bucketName: site.cdk.bucket.bucketName,
    distributionId: site.cdk.distribution.distributionId,
  });

  return {
    site,
  };
}
