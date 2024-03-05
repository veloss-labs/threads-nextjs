import Search from '~/components/search/search';

interface Props {
  searchParams: { keyword: string | undefined };
}

export default function Pages({ searchParams }: Props) {
  return <Search initialKeyword={searchParams.keyword} />;
}
