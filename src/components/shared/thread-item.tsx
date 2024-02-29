'use client';
import { Card } from '~/components/ui/card';
import Avatars from '~/components/shared/avatars';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { TipTapEditor } from '~/components/editor/tiptap-editor';
import { cn, getDateFormatted } from '~/utils/utils';
import type { ThreadSelectSchema } from '~/services/db/selectors/threads';
import { Icons } from '../icons';
import { Button } from '../ui/button';

interface ThreadItemProps {
  item: ThreadSelectSchema;
}

export default function ThreadItem({ item }: ThreadItemProps) {
  // const updateLikeFn = likeThreadAction.bind(null, {
  //   threadId: item.id,
  //   isLike: item.isLiked,
  // });

  // const updateRepostFn = repostThreadAction.bind(null, {
  //   threadId: item.id,
  // });

  const date = item ? getDateFormatted(item.createdAt) : null;
  // const [isPending, startTransition] = useTransition();
  // const queryClient = useQueryClient();
  // const { queryKey } = useKeyContext();

  // const onClickLike = async () => {
  //   startTransition(async () => {
  //     await updateLikeFn();
  //     await queryClient.invalidateQueries({
  //       queryKey,
  //     });
  //   });
  // };

  // const onClickRepost = () => {
  //   startTransition(async () => {
  //     await updateRepostFn();
  //     await queryClient.invalidateQueries({
  //       queryKey,
  //     });
  //   });
  // };

  return (
    <Card className="m-3 mx-auto overflow-hidden rounded-none border-x-0 border-b border-t-0 shadow-none dark:bg-background">
      <div className="md:flex">
        <div className="md:shrink-0">
          <span className="size-[192px] rounded-md bg-muted object-cover md:w-48" />
        </div>
        <div className="w-full py-2">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center">
              <Avatars
                src={undefined}
                alt={`${item?.user?.username} profile picture`}
                fallback="T"
              />
              <div className="ml-4 flex w-full flex-row">
                <div className="space-y-1">
                  <div className="text-base font-semibold tracking-wide text-black dark:text-white">
                    {item?.user?.username}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-300">
                    @{item?.user?.name}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-3">
                  <div
                    className="text-sm text-gray-400 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    {date}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" size="icon" className="!mr-2">
                        <Icons.moreHorizontal className="size-5" />
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
              name={`thraed-text-${item?.id}`}
              value={item?.text}
              noBorder
              className={cn(
                'prose prose-brand prose-headings:font-display font-default focus:outline-none',
              )}
              customClassName="p-0 mt-4"
            />
          </div>
          <div className="flex items-center justify-end space-x-4 py-4">
            <div className="flex items-center space-x-1">
              {/* <Button size="sm" variant="link">
                <Icons.messageSquare className="h-4 w-4" />
              </Button> */}

              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="link">
                    {item.isReposted ? (
                      <Icons.repostCheck className="size-4" />
                    ) : (
                      <Icons.repeat className="size-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={onClickRepost}
                    className={cn(
                      item.isReposted ? 'text-red-500 dark:text-red-400' : '',
                    )}
                  >
                    {isPending && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    {item.isReposted ? '삭제' : '리포스트'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>인용하기</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <Button
                size="sm"
                variant="link"
                // onClick={onClickLike}
                // disabled={isPending}
              >
                <Icons.heart
                  className={cn(
                    'h-4 w-4',
                    // item?.isLiked ? 'text-red-500 dark:text-red-400' : '',
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
