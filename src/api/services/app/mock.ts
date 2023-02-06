import { ApiService } from '~/api/client';
import { routesMiddleware } from '../middleware/routeMiddleware';

import type { BaseApiOptions } from '~/api/ts/schema';

export const getBaseCsrfApi = async (options?: BaseApiOptions['ky']) => {
  const resp = await ApiService.getJson<{ csrfToken: string }>(
    ApiService._API_ROUTES.csrf,
    options,
  );
  return resp.csrfToken;
};

export const getCsrfApi = (options?: BaseApiOptions) => {
  const opts = routesMiddleware(
    Object.assign({}, options, { canOverride: true }),
  );
  return getBaseCsrfApi(opts);
};

export const getBaseHelloApi = async (options?: BaseApiOptions['ky']) => {
  const resp = await ApiService.getJson<{ name: string }>(
    ApiService._API_ROUTES.hello,
    options,
  );
  return resp.name;
};

export const getHelloApi = (options?: BaseApiOptions) => {
  const opts = routesMiddleware(
    Object.assign({}, options, { canOverride: true }),
  );
  return getBaseHelloApi(opts);
};
