'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';
import { api } from '~/services/trpc/react';
import useNavigateThreanForm from '~/libs/hooks/useNavigateThreanForm';

interface ProfileHeaderProps {
  userId: string;
  isMe: boolean;
  initialData?: any;
}

export default function ProfileHeader({
  userId,
  isMe,
  initialData,
}: ProfileHeaderProps) {
  const [data] = api.users.byId.useSuspenseQuery(
    {
      userId,
    },
    {
      initialData,
    },
  );

  const followCount = data?._count.followers ?? 0;
  const isFollowing = (data?.followers?.length ?? 0) > 0;

  return (
    <div className="py-4">
      <div className="grid-cols-max grid items-center gap-4">
        <div className="col-start-1">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {data?.username}
          </h2>
          <div className="mt-[2px]">
            <div className="flex items-center">
              <small className="text-sm font-medium leading-none">
                @{data?.name}
              </small>
            </div>
          </div>
        </div>
        <div className="col-start-2">
          <div className="text-align-inherit m-0 box-border flex cursor-pointer touch-manipulation rounded-full border-0 bg-transparent p-0 outline-none">
            <div className="size-[64px] md:size-[84px]">
              <div className="flex size-full rounded-full bg-white">
                <img
                  height="100%"
                  width="100%"
                  alt={`${data?.username}님의 프로필 사진`}
                  className="profile-outline size-full rounded-full object-cover"
                  src={data?.image ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[18px] flex min-h-[22px] items-center">
        <div className="flex shrink-0">
          <p className="text-sm text-muted-foreground hover:cursor-pointer hover:underline">
            팔로우 {followCount}명
          </p>
        </div>
      </div>
      {!isMe && (
        <div className="mt-4 flex w-full space-x-2">
          <ProfileHeader.FollowButton
            userId={userId}
            isFollowing={isFollowing}
          />
          <ProfileHeader.MentionButton
            userId={userId}
            username={data?.username}
            name={data?.name}
          />
        </div>
      )}
    </div>
  );
}

interface MentionButtonProps {
  userId: string;
  username: string | null | undefined;
  name: string | null | undefined;
}

ProfileHeader.MentionButton = function Item(props: MentionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { handleHref, isPending } = useNavigateThreanForm();

  const onClickMentions = useCallback(() => {
    handleHref({
      intialValue: props,
    });
  }, [handleHref, props]);

  return (
    <Button variant="outline" className="flex-1" onClick={onClickMentions}>
      {isPending && <Icons.rotateCcw className="mr-2 size-4 animate-spin" />}
      언급
    </Button>
  );
};

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

ProfileHeader.FollowButton = function Item({
  userId,
  isFollowing,
}: FollowButtonProps) {
  const utils = api.useUtils();

  const followMutation = api.users.follow.useMutation({
    async onSuccess() {
      await utils.users.byId.invalidate();
    },
  });

  const unfollowMutation = api.users.unfollow.useMutation({
    async onSuccess() {
      await utils.users.byId.invalidate();
    },
  });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const onClickFollow = useCallback(() => {
    if (isFollowing) {
      unfollowMutation.mutate({ targetId: userId });
    } else {
      followMutation.mutate({ targetId: userId });
    }
  }, [followMutation, isFollowing, unfollowMutation, userId]);

  return (
    <Button className="flex-1" onClick={onClickFollow} disabled={isPending}>
      {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      {isFollowing ? '팔로우 취소' : '팔로우'}
    </Button>
  );
};
