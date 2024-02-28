import SearchInput from '~/components/search/search-input';
import SearchWapper from '~/components/search/search-wrapper';
import UserList from '~/components/shared/user-list';
import { api } from '~/services/trpc/server';

interface Props {
  searchParams: { keyword: string | undefined };
}

export default async function Pages({ searchParams }: Props) {
  const initialData = await api.users.getSearchUsers({
    keyword: searchParams?.keyword,
  });

  return (
    <>
      <SearchInput defaultValue={searchParams.keyword} />
      <SearchWapper>
        <UserList keyword={searchParams.keyword} initialData={initialData} />
      </SearchWapper>
    </>
  );
}
