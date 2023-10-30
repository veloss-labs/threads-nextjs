import { Card } from '~/components/ui/card';
import Avatars from '~/components/shared/avatars';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { TipTapEditor } from '~/components/editor/tiptap-editor';
import { cn, getDateFormatted } from '~/utils/utils';

import type { ThreadItemSchema } from '~/services/threads/threads.model';
import { Icons } from '../icons';
import { Button } from '../ui/button';

interface ThreadItemProps {
  item: ThreadItemSchema;
}

export default function ThreadItem({ item }: ThreadItemProps) {
  const date = getDateFormatted(item.createdAt);
  return (
    <Card className="m-3 mx-auto overflow-hidden rounded-none border-x-0 border-b border-t-0 shadow-none">
      <div className="md:flex">
        <div className="md:shrink-0">
          <span className="h-[192px] w-[192px] rounded-md bg-muted object-cover md:w-48" />
        </div>
        <div className="w-full py-2">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center">
              <Avatars
                src={item.user?.image ?? undefined}
                alt={`${item.user?.username} profile picture`}
                fallback="T"
              />
              <div className="ml-4 flex w-full flex-row">
                <div>
                  <div className="text-base font-semibold tracking-wide text-black dark:text-white">
                    {item.user?.username}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-300">
                    @{item.user?.name}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-end">
                  <div
                    className="text-sm text-gray-400 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    {date}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" size="sm" className="ml-2">
                        <Icons.moreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>업데이트 안 보기</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>숨기기</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        차단하기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        신고하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <TipTapEditor
              editable={false}
              debouncedUpdatesEnabled={false}
              name={`thraed-text-${item.id}`}
              value={item.text}
              noBorder
              className={cn(
                'prose prose-brand prose-headings:font-display font-default focus:outline-none',
              )}
              customClassName="p-0 mt-4"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
