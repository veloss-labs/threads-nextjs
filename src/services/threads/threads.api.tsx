import { FetchService } from '~/services/fetch/fetch.client';
import type { ThreadQuery } from './threads.query';
import type { ThreadSchema } from './threads.model';
import { createSearchParams } from '~/utils/utils';

export const getThreadsApi = async (query?: ThreadQuery) => {
  const searchParams = createSearchParams(query);
  const params = FetchService.getSearchParams(
    FetchService.defineApis.threads.root,
    searchParams,
  );
  const response = await FetchService.get(params);
  return (await FetchService.toJson(response)) as ThreadSchema;
};

export const getThreadLikesApi = async (query?: ThreadQuery) => {
  const searchParams = createSearchParams(query);
  const params = FetchService.getSearchParams(
    FetchService.defineApis.threads.likes.root,
    searchParams,
  );
  const response = await FetchService.get(params);
  return (await FetchService.toJson(response)) as ThreadSchema;
};
