import truncate from 'lodash-es/truncate';
import React from 'react';
import { api } from '~/services/trpc/react';
import { getDateFormatted } from '~/utils/utils';

interface QuotationProps {
  id: string;
}

export default function Quotation({ id }: QuotationProps) {
  const [data] = api.threads.simpleById.useSuspenseQuery({ threadId: id });

  const date = data ? getDateFormatted(data.createdAt) : null;

  // html 태그를 전부 제거하고 text만 가져옵니다.
  const descriptionWithoutHTML = data?.text?.replace(/(<([^>]+)>)/gi, '') ?? '';
  const description = truncate(descriptionWithoutHTML, { length: 300 });

  return (
    <div className="flex w-full py-4">
      <div className="flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{data?.user?.username}</div>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">{date}</div>
          </div>
          <div className="text-xs font-medium"> @{data?.user?.name}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}
