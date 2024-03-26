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
import React, { useCallback } from 'react';
import { api } from '~/services/trpc/react';
import { useToast } from '~/components/ui/use-toast';
import { ToastAction } from '~/components/ui/toast';
import { useRouter } from 'next/navigation';
import { EMBED_CODE, PAGE_ENDPOINTS } from '~/constants/constants';
import ClientOnly from '~/components/shared/client-only';
import { Skeleton } from '../ui/skeleton';
import dynamic from 'next/dynamic';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import Modal from '~/components/modal';
import { useCopyToClipboard } from '~/libs/hooks/useCopyToClipboard';
import { Textarea } from '~/components/ui/textarea';

const WhoCanLeaveReplyDialog = dynamic(
  () => import('~/components/dialog/who-can-leave-reply-dialog'),
  {
    ssr: false,
  },
);

interface ThreadItemProps {
  item: ThreadSelectSchema;
}

export default function ThreadItem({ item }: ThreadItemProps) {
  const date = item ? getDateFormatted(item.createdAt) : null;
  const router = useRouter();

  const onClick = useCallback(
    (hashTag: string) => {
      const tags = item.tags.map((current) => current.tag);
      const currentTag = tags.find((current) => current.name === hashTag);
      if (!currentTag) {
        return;
      }
      const searchParams = new URLSearchParams({
        keyword: currentTag.name,
        searchType: 'tags',
        tagId: currentTag.id,
      });
      const url = new URL(PAGE_ENDPOINTS.SEARCH, window.location.origin);
      url.search = searchParams.toString();
      router.push(url.toString());
    },
    [item.tags, router],
  );

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
                        isSaved={(item?.bookmarks?.length ?? 0) > 0}
                      />
                      <DropdownMenuSeparator />
                      <React.Suspense
                        fallback={
                          <>
                            <DropdownMenuItem>
                              <Skeleton className="h-4 w-[150px]" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Skeleton className="h-4 w-[150px]" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Skeleton className="h-4 w-[150px]" />
                            </DropdownMenuItem>
                          </>
                        }
                      >
                        <ThreadItem.ConditionUserInfo
                          itemId={item.id}
                          userId={item.user.id}
                          whoCanLeaveComments={item.whoCanLeaveComments}
                          isHidden={item.hiddenNumberOfLikesAndComments}
                        />
                      </React.Suspense>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <ClientOnly fallback={<LexicalEditor.Skeleton />}>
              <LexicalEditor
                editable={false}
                initialHTMLValue={item.text}
                hashtagsEventListener={(event) => {
                  const element = event.target as HTMLSpanElement;
                  if (
                    element &&
                    element.getAttribute('data-type') === 'hashtag'
                  ) {
                    const dataValue = element.getAttribute('data-value');
                    if (dataValue) {
                      onClick(dataValue);
                    }
                    return;
                  }

                  if (
                    element &&
                    element.getAttribute('data-type') === 'mention'
                  ) {
                    const dataValue = element.getAttribute('data-value');
                    if (dataValue) {
                      console.log(dataValue);
                    }
                  }
                }}
              />
            </ClientOnly>
          </div>
          <div className="flex items-center justify-end space-x-4 py-4">
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="link">
                <Icons.messageSquare className="size-4" />
              </Button>
              <ThreadItem.RepostsButton
                itemId={item.id}
                isReposted={(item?.reposts?.length ?? 0) > 0}
              />
              <ThreadItem.LikeButton
                itemId={item.id}
                isLiked={(item?.likes?.length ?? 0) > 0}
              />
              <ThreadItem.ShareButton
                itemId={item.id}
                userId={item.user.id}
                username={item.user.username}
              />
            </div>
          </div>
        </div>
      </div>
      <WhoCanLeaveReplyDialog />
    </Card>
  );
}

interface ItemProps {
  itemId: string;
}

interface RepostItemProps extends ItemProps {
  isReposted: boolean;
}

ThreadItem.RepostsButton = function Item({
  itemId,
  isReposted,
}: RepostItemProps) {
  const { toast } = useToast();

  const mutation = api.threads.repost.useMutation({
    async onSuccess(data) {
      const saved = data.data?.reposted ? 'REPOST' : 'UNREPOST';
      toast({
        description: saved === 'REPOST' ? '리포스트됨' : '삭제됨',
      });
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="link">
          {isReposted ? (
            <Icons.repostCheck className="size-4" />
          ) : (
            <Icons.repeat className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={onClick}
          className={cn({
            'text-red-500': isReposted,
          })}
        >
          {isReposted ? '삭제' : '리포스트'}
        </DropdownMenuItem>
        <DropdownMenuItem>인용하기</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ShareItemProps extends ItemProps {
  userId: string;
  username: string | null;
}

ThreadItem.ShareButton = function Item({
  itemId,
  userId,
  username,
}: ShareItemProps) {
  const { toast } = useToast();

  const { copy } = useCopyToClipboard({
    onSuccess: () => {
      toast({
        description: '복사됨',
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="link">
          <Icons.share className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => copy(PAGE_ENDPOINTS.USER.POST.ID(userId, itemId))}
        >
          링크복사
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            Modal.confirm({
              content: (
                <Textarea
                  rows={10}
                  defaultValue={EMBED_CODE.POST.ID(
                    username ?? 'Empty',
                    PAGE_ENDPOINTS.USER.POST.ID(userId, itemId),
                  )}
                />
              ),
              okCancel: false,
              okText: 'Embed 코드 복사',
              okButtonProps: {
                className: 'w-full',
              },
              onOk: () => {
                copy(
                  EMBED_CODE.POST.ID(
                    username ?? 'Empty',
                    PAGE_ENDPOINTS.USER.POST.ID(userId, itemId),
                  ),
                );
              },
            });
          }}
        >
          퍼가기 코드 받기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SaveItemProps extends ItemProps {
  isSaved: boolean;
}

ThreadItem.SaveButton = function Item({ itemId, isSaved }: SaveItemProps) {
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
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem onClick={onClick} disabled={mutation.isPending}>
      {mutation.isPending && (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      )}
      {isSaved ? '저장 취소' : '저장'}
    </DropdownMenuItem>
  );
};

interface ConditionUserInfoItemProps extends ItemProps {
  userId: string;
  whoCanLeaveComments: string | null;
  isHidden: boolean | null;
}

ThreadItem.ConditionUserInfo = function Item({
  userId,
  itemId,
  whoCanLeaveComments,
  isHidden,
}: ConditionUserInfoItemProps) {
  const [data] = api.auth.getRequireSession.useSuspenseQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const isMe = data ? data.user.id === userId : undefined;

  if (isMe) {
    return (
      <>
        <ThreadItem.WhoCanLeaveReplyButton
          itemId={itemId}
          initialWhoCanLeaveReply={whoCanLeaveComments ?? 'everyone'}
        />
        <DropdownMenuSeparator />
        <ThreadItem.HideNumberOfLikesAndSharesButton
          itemId={itemId}
          isHidden={isHidden ?? false}
        />
        <DropdownMenuSeparator />
        <ThreadItem.DeleteButton itemId={itemId} />
      </>
    );
  }

  return (
    <>
      <DropdownMenuItem>숨기기</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>업데이트 안보기</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-500">차단하기</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-500">신고하기</DropdownMenuItem>
    </>
  );
};

interface LikeItemProps extends ItemProps {
  isLiked: boolean;
}

ThreadItem.LikeButton = function Item({ itemId, isLiked }: LikeItemProps) {
  const mutation = api.threads.like.useMutation();

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

ThreadItem.DeleteButton = function Item({ itemId }: ItemProps) {
  const mutation = api.threads.delete.useMutation();

  const onClick = useCallback(() => {
    Modal.confirm({
      title: '게시물을 삭제하시겠어요?',
      description: '이 게시물을 삭제하면 복원할 수 없습니다.',
      okCancel: true,
      cancelButtonProps: {
        variant: 'default',
      },
      okButtonProps: {
        variant: 'destructive',
      },
      onOk: () => {
        mutation.mutate({
          threadId: itemId,
        });
      },
    });
  }, [itemId, mutation]);

  return (
    <DropdownMenuItem onClick={onClick} disabled={mutation.isPending}>
      삭제
    </DropdownMenuItem>
  );
};

interface HideNumberOfLikesAndSharesItemProps extends ItemProps {
  isHidden: boolean;
}

ThreadItem.HideNumberOfLikesAndSharesButton = function Item({
  itemId,
  isHidden,
}: HideNumberOfLikesAndSharesItemProps) {
  const { toast } = useToast();

  const mutation = api.threads.update.useMutation({
    async onSuccess(data) {
      const saved = data.data?.hiddenNumberOfLikesAndComments
        ? 'SAVE'
        : 'UNSAVE';
      toast({
        description:
          saved === 'SAVE'
            ? '좋아요 및 공유 숨김'
            : '좋아요 및 공유 숨기기 취소됨',
      });
    },
  });

  const onClick = useCallback(() => {
    mutation.mutate({
      threadId: itemId,
      hiddenNumberOfLikesAndComments: !isHidden,
    });
  }, [itemId, mutation, isHidden]);

  return (
    <DropdownMenuItem onClick={onClick} disabled={mutation.isPending}>
      좋아요 수 및 공유 수 숨기기 {isHidden ? '취소' : ''}
    </DropdownMenuItem>
  );
};

interface WhoCanLeaveReplyItemProps extends ItemProps {
  initialWhoCanLeaveReply: string;
}

ThreadItem.WhoCanLeaveReplyButton = function Item({
  itemId,
  initialWhoCanLeaveReply,
}: WhoCanLeaveReplyItemProps) {
  const { popupOpen } = useLayoutStore();

  const onClick = useCallback(() => {
    popupOpen('WHO_CAN_LEAVE_REPLY', {
      itemId,
      initialValue: initialWhoCanLeaveReply,
    });
  }, [initialWhoCanLeaveReply, itemId, popupOpen]);

  return (
    <DropdownMenuItem onClick={onClick}>
      답글을 남길 수 있는 사람
    </DropdownMenuItem>
  );
};
