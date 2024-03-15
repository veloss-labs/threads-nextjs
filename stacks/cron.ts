import path from 'node:path';
import fs from 'node:fs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Cron, StackContext } from 'sst/constructs';
import type { Module } from './env';

const prismaDatabaseLayerPath = './.sst/layers/prisma';

function preparePrismaLayerFiles() {
  // Remove any existing layer path data
  fs.rmSync(prismaDatabaseLayerPath, { force: true, recursive: true });

  // Create a fresh new layer path
  fs.mkdirSync(prismaDatabaseLayerPath, { recursive: true });

  // Prisma folders to retrieve the client and the binaries from
  const prismaFiles = [
    'node_modules/@prisma/client',
    'node_modules/prisma/build',
  ];

  for (const file of prismaFiles) {
    fs.cpSync(file, path.join(prismaDatabaseLayerPath, 'nodejs', file), {
      // Do not include binary files that aren't for AWS to save space
      filter: (src) =>
        !src.endsWith('so.node') ||
        src.includes('rhel') ||
        src.includes('linux-arm64'),
      recursive: true,
    });
  }
}

export function CronStack({ stack }: StackContext, env: Module['env']) {
  preparePrismaLayerFiles();

  // Creation of the Prisma layer
  const prismaLayer = new lambda.LayerVersion(stack, 'PrismaLayer', {
    code: lambda.Code.fromAsset(path.resolve(prismaDatabaseLayerPath)),
  });

  // Add the Prisma layer to all functions in this stack
  stack.addDefaultFunctionLayers([prismaLayer]);

  const cron = new Cron(stack, 'daliy-recommendations', {
    // schedule: 'rate(1 day)',
    schedule: 'rate(1 minute)',
    job: 'functions/daliy-recommendations.handler',
  });

  stack.addOutputs({
    CronId: cron.id,
  });
}
