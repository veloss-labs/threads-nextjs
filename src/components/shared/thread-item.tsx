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
import LexicalEditor from '~/components/editor/lexical-editor';
import { cn, getDateFormatted } from '~/utils/utils';
import type { ThreadSelectSchema } from '~/services/db/selectors/threads';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { useCallback } from 'react';
import { api } from '~/services/trpc/react';
import { useToast } from '~/components/ui/use-toast';
import { ToastAction } from '~/components/ui/toast';
import { useRouter } from 'next/navigation';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import ClientOnly from '~/components/shared/client-only';

interface ThreadItemProps {
  item: ThreadSelectSchema;
}

export default function ThreadItem({ item }: ThreadItemProps) {
  const utils = api.useUtils();

  const { data } = api.auth.getRequireSession.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const isMe = data ? data.user.id === item.user.id : undefined;

  const mutationByLike = api.threads.like.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
      ]);
    },
  });

  const onClickLike = useCallback(() => {
    mutationByLike.mutate({
      threadId: item.id,
    });
  }, [item.id, mutationByLike]);

  const date = item ? getDateFormatted(item.createdAt) : null;

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
                      <ThreadItem.SaveButton
                        itemId={item.id}
                        isSaved={item?.bookmarks.length > 0}
                      />
                      <DropdownMenuSeparator />
                      {isMe ? (
                        <>
                          <ThreadItem.WhoCanLeaveReplyButton itemId={item.id} />
                          <DropdownMenuSeparator />
                          <ThreadItem.HideNumberOfLikesAndSharesButton
                            itemId={item.id}
                          />
                          <DropdownMenuSeparator />
                          <ThreadItem.DeleteButton itemId={item.id} />
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem>숨기기</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>업데이트 안보기</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            차단하기
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            신고하기
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <ClientOnly fallback={<LexicalEditor.Skeleton />}>
              <LexicalEditor editable={false} initialHTMLValue={item.text} />
            </ClientOnly>
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

              <ThreadItem.LikeButton
                itemId={item.id}
                isLiked={item?.likes.length > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ItemProps {
  itemId: string;
}

interface LikeItemProps extends ItemProps {
  isLiked: boolean;
}

ThreadItem.LikeButton = function Item({ itemId, isLiked }: LikeItemProps) {
  const utils = api.useUtils();

  const mutation = api.threads.like.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
      ]);
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <Button
      size="sm"
      variant="link"
      onClick={onClick}
      disabled={mutation.isPending}
    >
      <Icons.heart
        className={cn(
          'h-4 w-4',
          isLiked ? 'text-red-500 dark:text-red-400' : '',
        )}
      />
    </Button>
  );
};

interface SaveItemProps extends ItemProps {
  isSaved: boolean;
}

ThreadItem.SaveButton = function Item({ itemId, isSaved }: SaveItemProps) {
  const utils = api.useUtils();

  const router = useRouter();

  const { toast } = useToast();

  const mutation = api.threads.save.useMutation({
    async onSuccess(data) {
      const saved = data.data?.saved ? 'SAVE' : 'UNSAVE';
      toast({
        description: saved === 'SAVE' ? '저장됨' : '저장 취소됨',
        action: (
          <ToastAction
            altText={`${saved === 'SAVE' ? '모두보기' : '되돌리기'}`}
            onClick={() => {
              if (saved === 'SAVE') {
                router.push(PAGE_ENDPOINTS.SAVED);
                return;
              }

              mutation.mutate({
                threadId: itemId,
              });
            }}
          >
            {saved === 'SAVE' ? '모두보기' : '되돌리기'}
          </ToastAction>
        ),
      });

      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getBookmarks.invalidate(),
      ]);
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={onClick}
        disabled={mutation.isPending}
      >
        {mutation.isPending && (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        )}
        {isSaved ? '저장 취소' : '저장'}
      </Button>
    </DropdownMenuItem>
  );
};

ThreadItem.DeleteButton = function Item({ itemId }: ItemProps) {
  const utils = api.useUtils();

  const mutation = api.threads.delete.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
      ]);
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem asChild>
      <Button variant="destructive" size="sm" className="w-full">
        삭제
      </Button>
    </DropdownMenuItem>
  );
};

ThreadItem.HideNumberOfLikesAndSharesButton = function Item({
  itemId,
}: ItemProps) {
  const utils = api.useUtils();

  const mutation = api.threads.delete.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
      ]);
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem asChild>
      <Button variant="ghost" size="sm" className="w-full">
        좋아요 수 및 공유 수 숨기기
      </Button>
    </DropdownMenuItem>
  );
};

ThreadItem.WhoCanLeaveReplyButton = function Item({ itemId }: ItemProps) {
  const utils = api.useUtils();

  const mutation = api.threads.delete.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
      ]);
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem asChild>
      <Button variant="ghost" size="sm" className="w-full">
        답글을 남길 수 있는 사람
      </Button>
    </DropdownMenuItem>
  );
};
