import { useQuery } from '@tanstack/react-query';
import {
  getCsrfApi,
  getDetailSitemapApi,
  getHelloApi,
  type Sitemap,
} from '~/api/services/app/mock';
import type { BaseApiOptions } from '~/api/ts/schema';
import type { UseQueryOptions, QueryFunction } from '@tanstack/react-query';
import type { IsRequired, NullableUndefinedable } from '~/ts/common';

type QueryOptions = Omit<
  UseQueryOptions<any, unknown, string, string[]>,
  'initialData' | 'queryFn' | 'queryKey'
> & {
  initialData?: any;
};

interface UseBaseQuery extends QueryOptions {
  apiOptions?: BaseApiOptions;
}

// ------------------------------ CSRF

export const useCsrfQuery = (options?: UseBaseQuery) => {
  const { apiOptions, ...queryOpts } = options || {};

  const loader: QueryFunction<string, string[]> = async (key) => {
    const opts = Object.assign({}, apiOptions, { key });
    return getCsrfApi(opts);
  };

  const baseOptions = Object.assign({}, queryOpts, {});

  return useQuery([getCsrfApi.name], loader, baseOptions);
};

// ------------------------------ Hello

export const useHelloQuery = (options?: UseBaseQuery) => {
  const { apiOptions, ...queryOpts } = options || {};

  const loader: QueryFunction<string, string[]> = async (key) => {
    const opts = Object.assign({}, apiOptions, { key });
    return getHelloApi(opts);
  };

  const baseOptions = Object.assign({}, queryOpts, {});

  return useQuery([getHelloApi.name], loader, baseOptions);
};

// ------------------------------ Sitemap

type SitemapDetailQueryKey = (
  | string
  | {
      id: NullableUndefinedable<string | number>;
    }
)[];

type SitemapDetailQueryOptions = Omit<
  UseQueryOptions<any, unknown, Sitemap, SitemapDetailQueryKey>,
  'initialData' | 'queryFn' | 'queryKey'
> & {
  initialData?: any;
};

interface UseSitemapDetailQuery extends SitemapDetailQueryOptions {
  apiOptions?: BaseApiOptions;
}

export const useSitemapDetailQuery = (
  id: NullableUndefinedable<string | number>,
  options?: UseSitemapDetailQuery,
) => {
  const { apiOptions, ...queryOpts } = options || {};

  const loader: QueryFunction<Sitemap, SitemapDetailQueryKey> = async (key) => {
    const opts = Object.assign({}, apiOptions, { key });
    return getDetailSitemapApi(id as IsRequired<string | number>, opts);
  };

  const baseOptions = Object.assign({}, queryOpts, {
    enabled: !!id,
  });

  return useQuery([getDetailSitemapApi.name, { id }], loader, baseOptions);
};
