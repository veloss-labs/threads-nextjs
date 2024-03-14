import Search from '~/components/search/search';
import { api } from '~/services/trpc/server';

interface Props {
  searchParams: { keyword: string | undefined };
}

export default async function Pages({ searchParams }: Props) {
  const initialData = await api.users.getSearchUsers({
    keyword: searchParams.keyword,
  });
  return (
    <Search initialKeyword={searchParams.keyword} initialData={initialData} />
  );
}
