'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '~/components/ui/input';

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (e.target.value) {
        searchParams.set('keyword', e.target.value);
      } else {
        searchParams.delete('keyword');
      }

      startTransition(() => {
        router.push(`${pathname}?${searchParams.toString()}`);
      });
    },
    250,
  );

  return (
    <div className="flex w-full flex-col">
      <Input
        type="search"
        name="keyword"
        defaultValue={defaultValue}
        placeholder="검색"
        onChange={onChange}
      />
    </div>
  );
}
