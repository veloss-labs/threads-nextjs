import { FetchService } from '~/services/fetch/fetch.client';
import { SearchQuery } from './search.query';
import { SearchSchema } from './search.model';
import { createSearchParams } from '~/utils/utils';

export const getSearchApi = async (query?: SearchQuery) => {
  const searchParams = createSearchParams(query);
  const params = FetchService.getSearchParams(
    FetchService.defineApis.search.root,
    searchParams,
  );
  const response = await FetchService.get(params);
  return (await FetchService.toJson(response)) as SearchSchema;
};
