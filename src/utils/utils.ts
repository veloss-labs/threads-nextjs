import { isEmpty, isUndefined } from '~/utils/assertion';
import { apiHost } from '~/constants/env';
import { isBrowser } from '~/libs/browser/dom';

import type { NestedKeyOf, NestedObjectValueOf, Nullable } from '~/ts/common';
import type { GetServerSidePropsContext, NextPageContext } from 'next';

export const getNestedKeyOfValue = <T extends Record<string, any>>(
  object: T,
  path: NestedKeyOf<T>,
) => {
  const paths = path.split(/[,[\].]+?/).filter(Boolean);

  const result = paths.reduce((acc, cur) => {
    if (isEmpty(acc) || isUndefined(acc)) {
      return acc;
    }
    return acc[cur];
  }, object);

  // @ts-ignore
  return result as NestedObjectValueOf<T, NestedKeyOf<T>>;
};

type GetUrlParams = {
  ctx?: Nullable<GetServerSidePropsContext | NextPageContext>;
  nextApiRoutes?: boolean;
};

export const getUrl = ({ ctx, nextApiRoutes }: GetUrlParams) => {
  const _NEXT_API_ROUTES_PATHNAME = '/api';
  const _NEXT_COMMON_PATHNAME = '/';
  const baseUrl = nextApiRoutes
    ? _NEXT_API_ROUTES_PATHNAME
    : _NEXT_COMMON_PATHNAME;

  if (!apiHost) {
    if (ctx && ctx.req) {
      const { headers } = ctx.req;
      const host = headers.host;
      const protocol = headers['x-forwarded-proto'] || 'http';
      return new URL(baseUrl, `${protocol}://${host}`);
    } else if (isBrowser) {
      return new URL(baseUrl, location.origin);
    }
  }

  // apiHost의 pathname을 split해서 baseUrl에 붙여준다.
  // ex) apiHost: https://api.example.com/api/v1
  //     baseUrl: https://api.example.com
  //     pathname: /api/v1
  return new URL(apiHost);
};
