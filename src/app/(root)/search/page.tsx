'use client';
import PageLoading from '~/components/layout/page-loading';
import Search from '~/components/search/search';
import ClientOnly from '~/components/shared/client-only';

interface Props {
  searchParams: { keyword: string | undefined };
}

export default function Pages({ searchParams }: Props) {
  return (
    <ClientOnly fallback={<PageLoading />}>
      <Search initialKeyword={searchParams.keyword} />
    </ClientOnly>
  );
}
