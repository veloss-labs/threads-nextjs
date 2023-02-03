import type { GetServerSidePropsContext } from 'next';
import type { QueryFunctionContext } from '@tanstack/react-query';
import type { Options } from 'ky';

export type BaseResponse<R = unknown> = R;

export type BaseApiOptions = {
  ctx?: GetServerSidePropsContext;
  key?: QueryFunctionContext;
  ky?: Options | undefined;
};
