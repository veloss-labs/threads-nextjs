#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Command } from 'commander';
import chalk from 'chalk';

const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args));
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
};

const DevEnv = {
  development: 'development',
  dev: 'dev',
  d: 'd',
} as const;

type DevValues = keyof typeof DevEnv;

const ProdEnv = {
  production: 'production',
  prod: 'prod',
  p: 'p',
} as const;

type ProdValues = keyof typeof ProdEnv;

const StagingEnv = {
  staging: 'staging',
  stg: 'stg',
} as const;

type StagingValues = keyof typeof StagingEnv;

const SandboxEnv = {
  sandbox: 'sandbox',
  sbx: 'sbx',
} as const;

type SandboxValues = keyof typeof SandboxEnv;

const CommonEnv = {
  test: 'test',
  local: 'local',
} as const;

type CommonValues = keyof typeof CommonEnv;

type Env =
  | DevValues
  | ProdValues
  | StagingValues
  | SandboxValues
  | CommonValues;

interface CliFlags {
  /** @internal Used in CI */
  root: string;
  /** @internal Used in CI. */
  env: Env;
}

interface CliResults {
  appName: string;
  flags: CliFlags;
}

const defaultOptions: CliResults = {
  appName: 'SST-NEXT-TEMPLATE',
  flags: {
    root: '.env',
    env: CommonEnv.local,
  },
};

const getVersion = () => {
  return '0.0.1';
};

const getAvailableEnvs = () => {
  const envs: Env[] = [];
  const prefix = '.env.';
  Object.keys(ProdEnv).forEach((key) => {
    const safeKey = key as ProdValues;
    const name = prefix + ProdEnv[safeKey];
    envs.push(name as Env);
  });
  Object.keys(DevEnv).forEach((key) => {
    const safeKey = key as DevValues;
    const name = prefix + DevEnv[safeKey];
    envs.push(name as Env);
  });
  Object.keys(StagingEnv).forEach((key) => {
    const safeKey = key as StagingValues;
    const name = prefix + StagingEnv[safeKey];
    envs.push(name as Env);
  });
  Object.keys(SandboxEnv).forEach((key) => {
    const safeKey = key as SandboxValues;
    const name = prefix + SandboxEnv[safeKey];
    envs.push(name as Env);
  });
  Object.keys(CommonEnv).forEach((key) => {
    const safeKey = key as CommonValues;
    const name = prefix + CommonEnv[safeKey];
    envs.push(name as Env);
  });
  return envs;
};

const replaceEnvFileName = (env: Env) => {
  if (env.match(/^(dev|development|d)$/)) {
    return env.replace(/^(dev|development|d)$/, '.env.development');
  }

  if (env.match(/^(prod|production|p)$/)) {
    return env.replace(/^(prod|production|p)$/, '.env.production');
  }

  if (env.match(/^(staging|stg)$/)) {
    return env.replace(/^(staging|stg)$/, '.env.staging');
  }

  if (env.match(/^(sandbox|sbx)$/)) {
    return env.replace(/^(sandbox|sbx)$/, '.env.sandbox');
  }

  return env.replace(/^(local|test)$/, '.env.$1');
};

const validationExistsEnv = (): void => {
  const rootPath = path.resolve();
  const envFolderPath = path.resolve(rootPath, './scripts/env');

  if (!fs.existsSync(envFolderPath)) {
    logger.info(`[Environment] -  create folder: ${envFolderPath}`);
    fs.mkdirSync(envFolderPath);
  }

  const availableEnvs = getAvailableEnvs();
  const createdEnvs = fs.readdirSync(envFolderPath);

  const checkList = createdEnvs.some((file) =>
    availableEnvs.includes(file as Env),
  );

  if (!checkList) {
    logger.error(
      `[Environment] - Please check the config files in the folder: "${envFolderPath}"`,
    );
    process.exit(0);
  }
};

const processenvironmentSetting = (
  replaceEnvName: string,
  rootEnvName: string,
) => {
  // load by project environment variables
  let envFileData: dotenv.DotenvConfigOutput;

  const rootPath = path.resolve();
  const envFilePath = path.resolve(rootPath, './scripts/env', replaceEnvName);
  const rootSettingEnvPath = path.resolve(rootPath, rootEnvName);

  try {
    envFileData = dotenv.config({
      path: envFilePath,
    });

    if (envFileData.error) {
      throw envFileData.error;
    }
  } catch (error) {
    logger.error(
      `[Environment] - Please check the config file: "${envFilePath}"`,
    );
    throw error;
  }

  if (!envFileData.parsed) {
    logger.error(
      `[Environment] - Please check the config file: "${envFilePath}"`,
    );
    const error = new Error();
    error.name = 'EnvironmentError';
    error.message = `Please check the config file: "${envFilePath}"`;
    throw error;
  }

  const envData = envFileData.parsed;

  fs.copyFileSync(envFilePath, rootSettingEnvPath);

  logger.success(
    `[Environment] - Successfully created environment file: "${rootSettingEnvPath}"`,
  );

  return envData;
};

const runCli = async () => {
  const cliResults = defaultOptions;
  const program = new Command().name(cliResults.appName);

  program
    .description('SST Next.js Template')
    .option(
      '--root <root>',
      `Root directory of the project. Defaults to ${defaultOptions.flags.root}.`,
      defaultOptions.flags.root,
    )
    .option(
      '--env <env>',
      `Environment to deploy to. Defaults to ${defaultOptions.flags.env}.`,
      CommonEnv.local,
    )
    .version(getVersion(), '-v, --version', 'SST-Next.js-Template version')
    .parse(process.argv);

  cliResults.flags = program.opts();

  try {
    const _root = cliResults.flags.root;
    const _env = replaceEnvFileName(cliResults.flags.env);
    const envData = processenvironmentSetting(_env, _root);
    logger.info(`[Environment] - ${JSON.stringify(envData)}`);
  } catch (error) {
    throw error;
  }

  return cliResults;
};

const main = async () => {
  // created env folder if not exists and check env files
  validationExistsEnv();

  const {
    appName,
    flags: { env },
  } = await runCli();

  logger.info(`[Environment] - ${appName} - ${env}`);

  process.exit(0);
};

main().catch((err) => {
  logger.error('An error has occurred.');
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      'An error has occurred, but it was not an instance of Error. Please report this.',
    );
    console.log(err);
  }
  process.exit(1);
});
