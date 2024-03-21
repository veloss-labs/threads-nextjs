'use client';
import React, {
  useCallback,
  useDeferredValue,
  useState,
  useTransition,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/utils';
import { Icons } from '~/components/icons';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import { api } from '~/services/trpc/react';
import SearchUserItem from '~/components/shared/search-user-item';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { ScrollArea } from '~/components/ui/scroll-area';
import SkeletonCardUserList from '~/components/skeleton/card-user-list';
import { isEmpty } from '~/utils/assertion';
import { useRouter } from 'next/navigation';
import SkeletonCardUser from '../skeleton/card-user';

interface SearchInputProps {
  initialKeyword?: string;
}

export default function SearchInput({ initialKeyword }: SearchInputProps) {
  const router = useRouter();
  const { popupOpen, popup, popupClose } = useLayoutStore();

  const [query, setQuery] = useState(initialKeyword ?? '');
  const deferredQuery = useDeferredValue(query);
  const [, startTransition] = useTransition();

  const isStale = query !== deferredQuery;
  const isSearch = deferredQuery && deferredQuery.length;
  const open = popup.open && popup.type === 'SEARCH_PAGE';

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        popupOpen('SEARCH_PAGE');
        return;
      }
      popupClose();
    },
    [popupClose, popupOpen],
  );

  const onSearch = useCallback(() => {
    setQuery(deferredQuery);
    popupClose();
    startTransition(() => {
      router.push(`/search?keyword=${deferredQuery}&searchType=default`);
    });
  }, [deferredQuery, popupClose, router]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch();
        return;
      }
    },
    [onSearch],
  );

  return (
    <div className="flex w-full flex-col">
      <Button
        variant="outline"
        type="button"
        className={cn(
          'relative h-16 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 space-x-3',
        )}
        onClick={() => onOpenChange(true)}
      >
        <Icons.search className="size-5" />
        <span className="inline-flex text-lg">{deferredQuery || '검색'}</span>
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>검색</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Icons.search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              className="px-8"
              placeholder="검색"
              value={query}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
            {isSearch && (
              <Icons.close
                className="absolute right-2 top-2.5 size-4 text-muted-foreground"
                onClick={() => setQuery('')}
              />
            )}
          </div>
          <Separator />
          {isSearch && (
            <SearchInput.SearchKeyword
              keyword={deferredQuery}
              onSearch={onSearch}
            />
          )}
          <ScrollArea className="h-72">
            <React.Suspense
              fallback={
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SearchInput.Card key={`skeleton:loading:${i}`}>
                      <SkeletonCardUser.Content />
                    </SearchInput.Card>
                  ))}
                </>
              }
            >
              <SearchInput.SearchList keyword={deferredQuery} />
            </React.Suspense>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SearchListProps {
  keyword?: string;
}

SearchInput.SearchList = function Item({ keyword }: SearchListProps) {
  const [data] = api.search.getSearchDialogUsers.useSuspenseQuery({
    keyword,
  });

  if (isEmpty(data)) {
    return (
      <div className="flex h-72 w-full items-center justify-center">
        <p className="text-center text-slate-700 dark:text-slate-300">
          검색 결과가 없습니다! 👋
        </p>
      </div>
    );
  }

  return (
    <>
      {data.map((user) => (
        <SearchInput.Card key={`search-dialog-${user.id}`}>
          <SearchUserItem.Content item={user} />
        </SearchInput.Card>
      ))}
    </>
  );
};

interface SearchKeywordProps {
  keyword?: string;
  onSearch: () => void;
}

SearchInput.SearchKeyword = function Item({
  keyword,
  onSearch,
}: SearchKeywordProps) {
  return (
    <>
      <SearchInput.Card>
        <div className="flex space-x-3">
          <div className="p-3">
            <Icons.search className="size-5 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-center">
            <span
              className={cn(
                `before:content-['"'] mr-2 inline-flex text-lg after:content-['"']`,
              )}
            >
              {keyword}
            </span>
            <span className="inline-flex text-lg">검색</span>
          </div>
        </div>
        <Button variant="link" size="sm" onClick={onSearch}>
          <Icons.chevronRight className="size-4 text-muted-foreground" />
        </Button>
      </SearchInput.Card>
      <Separator />
    </>
  );
};

interface SearchInputCardProps {
  children: React.ReactNode;
}

SearchInput.Card = function Item({ children }: SearchInputCardProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50  justify-between',
      )}
    >
      {children}
    </div>
  );
};
