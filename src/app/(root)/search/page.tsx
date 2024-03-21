'use client';
import PageLoading from '~/components/layout/page-loading';
import Search from '~/components/search/search';
import ClientOnly from '~/components/shared/client-only';

interface Props {
  searchParams: {
    keyword: string | undefined;
    searchType: 'tags' | 'mentions' | 'default' | undefined;
    tagId: string | undefined;
    userId: string | undefined;
  };
}

export default function Pages({ searchParams }: Props) {
  return (
    <ClientOnly fallback={<PageLoading />}>
      <Search
        keyword={searchParams.keyword}
        searchType={searchParams.searchType ?? 'default'}
        tagId={searchParams.tagId}
        userId={searchParams.userId}
      />
    </ClientOnly>
  );
}
