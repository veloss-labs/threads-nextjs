import { FetchService } from '~/services/fetch/fetch.client';
import { isEmpty, isNumber, isString, isArray } from '~/utils/assertion';
import { SearchQuery } from './search.query';
import { SearchSchema } from './search.model';

export const getSearchApi = async (query?: SearchQuery) => {
  const searchParams = new URLSearchParams();
  if (query && !isEmpty(query)) {
    Object.keys(query).forEach((key) => {
      const value = query[key as keyof SearchQuery];
      if (!value) return;
      if (isNumber(value)) searchParams.set(key, value.toString());
      if (isString(value)) searchParams.set(key, value);
      if (isArray(value)) searchParams.set(key, value.join(','));
    });
  }

  const params = FetchService.getSearchParams(
    FetchService.defineApis.search.root,
    searchParams,
  );

  const response = await FetchService.get(params);

  return (await FetchService.toJson(response)) as SearchSchema;
};
