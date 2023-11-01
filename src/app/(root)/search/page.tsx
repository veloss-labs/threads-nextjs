import SearchInput from '~/components/search/search-input';
import SearchWapper from '~/components/search/search-wrapper';
import UserList from '~/components/shared/user-list';
import { QUERIES_KEY } from '~/constants/constants';
import getQueryClient from '~/services/query/get-query-client';
import { searchService } from '~/services/search/search.server';

interface Props {
  searchParams: { q: string | undefined };
}

export default async function Pages({ searchParams }: Props) {
  const queryClient = getQueryClient();

  const q = searchParams?.q ?? undefined;

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERIES_KEY.users.search(q),
    initialPageParam: null,
    queryFn: async () => {
      return await searchService.getSearch({
        limit: 10,
        q,
      });
    },
  });

  const data = await queryClient.getQueryData<any>(QUERIES_KEY.users.search(q));

  const totalCount =
    data?.pages
      ?.map((page: any) => page?.totalCount)
      .flat()
      ?.at(0) ?? 0;

  const isEmptyData = totalCount === 0;

  return (
    <>
      <SearchInput defaultValue={q} />
      <SearchWapper>
        {isEmptyData ? <>Empty</> : <UserList q={q} type="root" />}
      </SearchWapper>
    </>
  );
}
