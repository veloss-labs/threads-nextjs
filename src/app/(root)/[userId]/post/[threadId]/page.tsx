import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import ThreadItem from '~/components/shared/thread-item';
import { SITE_CONFIG } from '~/constants/constants';
import { api } from '~/services/trpc/server';
import truncate from 'lodash-es/truncate';

interface Props {
  params: {
    userId: string;
    threadId: string;
  };
}

export async function generateMetadata({
  params,
}: Pick<Props, 'params'>): Promise<Metadata> {
  const initialData = await api.threads.byId(params);
  // html 태그를 전부 제거하고 text만 가져옵니다.
  const descriptionWithoutHTML =
    initialData?.text?.replace(/(<([^>]+)>)/gi, '') ?? '';
  const description = truncate(descriptionWithoutHTML, { length: 20 });
  const title = `@${initialData?.user?.username} • ${description}• ${SITE_CONFIG.title}`;
  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function Pages({ params }: Props) {
  const initialData = await api.threads.byId(params);
  if (!initialData) {
    notFound();
  }
  return <ThreadItem item={initialData} />;
}

export const dynamic = 'force-dynamic';
