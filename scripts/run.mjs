import shell from 'shelljs';
import * as Commander from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const program = new Commander.Command('create-template-app')
  .option(
    '-e, --environment <environment>',
    '어떤 .env.* 환경변수 파일을 사용할지 선택합니다.',
    'local',
  )
  .option(
    '-d --deploy <deploy>',
    '어떤 타입의 방법 으로 serverless 배포를 할지 선택합니다. --example [type](profile, cli)',
  )
  .allowUnknownOption()
  .parse(process.argv);

const regex = /^(local|development|production|dev|prod|p|d)$/;

const transformEnvironment = (environment) => {
  if (environment.match(/^(dev|development|d)$/)) {
    return environment.replace(/^(dev|development|d)$/, '.env.development');
  }

  if (environment.match(/^(prod|production|p)$/)) {
    return environment.replace(/^(prod|production|p)$/, '.env.production');
  }

  if (environment.match(/^(staging|stg)$/)) {
    return environment.replace(/^(staging|stg)$/, '.env.staging');
  }

  if (environment.match(/^(sandbox|sbx)$/)) {
    return environment.replace(/^(sandbox|sbx)$/, '.env.sandbox');
  }

  if (environment.match(/^(demo|dmo)$/)) {
    return environment.replace(/^(demo|dmo)$/, '.env.demo');
  }

  return environment.replace(regex, '.env.$1');
};

function environmentSetting(params) {
  const { rootEnvironment = '.env', environment = '.env.local' } = params;
  const appPath = path.resolve();
  const configPath = path.resolve(appPath, './scripts/env');

  // config 폴더가 없으면 생성
  if (!fs.existsSync(configPath)) {
    console.log('Environment] -  config empty, create config folder');
    shell.mkdir('-p', configPath);
  }

  const validFiles = [
    '.env.local',
    '.env.dev',
    '.env.development',
    '.env.prod',
    '.env.production',
    '.env.test',
    '.env.staging',
    '.env.stg',
    '.env.sandbox',
    '.env.sbx',
    '.env.demo',
    '.env.dmo',
  ];

  const checkList = fs
    .readdirSync(configPath)
    .filter((file) => !validFiles.includes(file));
  if (checkList.length > 0) {
    console.log(
      `[Environment] - config files is not found. ${checkList.join(', ')}`,
    );
    shell.exit(1);
  }

  // load by project environment variables
  let env;

  const envPath = path.resolve(configPath, environment);
  const rootPath = path.resolve(appPath, rootEnvironment);

  try {
    env = dotenv.config({
      path: envPath,
    });

    if (env.error) {
      throw env.error;
    }
  } catch (error) {
    console.log(
      ` [Environment] - "${error.message}" is not found.\nPlease fix the environment variable and try again.`,
    );
    shell.exit(1);
  }

  if (!env) {
    console.log(
      ` [Environment] - "${configPath}" is not found.\nPlease fix the environment variable and try again.`,
    );
    shell.exit(1);
  }

  // env variables copy for env to root folder .env copy
  fs.copyFileSync(envPath, rootPath);
  // success load by project environment variables
  console.log(`$Success! Created ${rootEnvironment}`);
}

export function run() {
  const options = program.opts();

  if (options.environment && !regex.test(options.environment)) {
    console.log(`[cli] - "${options.environment}" is not valid environment.`);
    shell.exit(1);
  }

  const environment = transformEnvironment(options.environment);

  environmentSetting({
    rootEnvironment: '.env',
    environment,
  });

  return;
}

run();
