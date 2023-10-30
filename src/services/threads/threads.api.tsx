import { FetchService } from '~/services/fetch/fetch.client';
import { isEmpty, isNumber } from '~/utils/assertion';
import type { ThreadQuery } from './threads.query';
import type { ThreadSchema } from './threads.model';

export const getThreadsApi = async (query?: ThreadQuery) => {
  const searchParams = new URLSearchParams();
  if (query && !isEmpty(query)) {
    Object.keys(query).forEach((key) => {
      const value = query[key as keyof ThreadQuery];
      const value2 = isNumber(value) ? value.toString() : value;
      if (value2) searchParams.set(key, value2);
    });
  }

  const params = FetchService.getSearchParams(
    FetchService.defineApis.threads.root,
    searchParams,
  );

  const response = await FetchService.get(params);

  return (await FetchService.toJson(response)) as ThreadSchema;
};
