import { FetchService } from '~/services/fetch/fetch.client';
import {
  isEmpty,
  isNumber,
  isString,
  isBoolean,
  isArray,
} from '~/utils/assertion';
import type { ThreadQuery } from './threads.query';
import type { ThreadSchema } from './threads.model';

export const getThreadsApi = async (query?: ThreadQuery) => {
  const searchParams = new URLSearchParams();
  if (query && !isEmpty(query)) {
    Object.keys(query).forEach((key) => {
      const value = query[key as keyof ThreadQuery];
      if (!value) return;
      if (isNumber(value)) searchParams.set(key, value.toString());
      if (isBoolean(value)) searchParams.set(key, value.toString());
      if (isString(value)) searchParams.set(key, value);
      if (isArray(value)) searchParams.set(key, value.join(','));
    });
  }

  const params = FetchService.getSearchParams(
    FetchService.defineApis.threads.root,
    searchParams,
  );

  const response = await FetchService.get(params);

  return (await FetchService.toJson(response)) as ThreadSchema;
};
