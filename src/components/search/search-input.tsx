'use client';
import React from 'react';
import { Input } from '~/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex w-full flex-col">
      <Input
        type="search"
        name="keyword"
        value={value}
        placeholder="검색"
        onChange={onChange}
      />
    </div>
  );
}
