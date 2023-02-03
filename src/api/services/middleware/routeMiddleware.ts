import { getUrl } from '~/utils/utils';
import type { BaseApiOptions } from '~/api/ts/schema';

interface RoutesMiddlewareOptions extends BaseApiOptions {
  canOverride?: boolean;
}

export const routesMiddleware = (options?: RoutesMiddlewareOptions) => {
  const url = getUrl({
    ctx: options?.ctx,
    nextApiRoutes: false,
  });

  const opts = {
    ...(options?.canOverride && {
      prefixUrl: url.href,
    }),
    ...options?.ky,
  };

  return opts;
};
