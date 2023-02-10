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

export type Sitemap = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const getBaseSitemapApi = async (options?: BaseApiOptions['ky']) => {
  const resp = await ApiService.getJson<{
    posts: Sitemap[];
  }>(ApiService._API_ROUTES.sitemap, options);
  return resp.posts;
};

export const getSitemapApi = (options?: BaseApiOptions) => {
  const opts = routesMiddleware(
    Object.assign({}, options, { canOverride: true }),
  );
  return getBaseSitemapApi(opts);
};

export const getBaseDetailSitemapApi = async (
  id: string | number,
  options?: BaseApiOptions['ky'],
) => {
  const resp = await ApiService.getJson<{
    post: Sitemap;
  }>(ApiService._API_ROUTES.sitemap_id(id), options);
  return resp.post;
};

export const getDetailSitemapApi = (
  id: string | number,
  options?: BaseApiOptions,
) => {
  const opts = routesMiddleware(
    Object.assign({}, options, { canOverride: true }),
  );
  return getBaseDetailSitemapApi(id, opts);
};
