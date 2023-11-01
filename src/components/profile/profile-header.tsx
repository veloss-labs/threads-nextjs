import React from 'react';
import { cn } from '~/utils/utils';

interface ProfileHeaderProps {
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

export default function ProfileHeader({
  name,
  username,
  image,
}: ProfileHeaderProps) {
  return (
    <div className="py-4">
      <ProfileHeader.Head name={name} username={username} image={image} />
      <ProfileHeader.Footer />
    </div>
  );
}

interface HeadProps extends ProfileHeaderProps {}

ProfileHeader.Head = function Item({ name, username, image }: HeadProps) {
  return (
    <div className="grid-cols-max grid items-center gap-4">
      <div className="col-start-1">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {username}
        </h2>
        <div className="mt-[2px]">
          <div className="flex items-center">
            <small className="text-sm font-medium leading-none">@{name}</small>
          </div>
        </div>
      </div>
      <div className="col-start-2">
        <div className="text-align-inherit m-0 box-border flex cursor-pointer touch-manipulation rounded-full border-0 bg-transparent p-0 outline-none">
          <div className="h-[64px] w-[64px] md:h-[84px] md:w-[84px]">
            <div className="flex h-full w-full rounded-full bg-white">
              <img
                height="100%"
                width="100%"
                alt={`${username}님의 프로필 사진`}
                className="profile-outline h-full w-full rounded-full object-cover"
                src={image ?? undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.Footer = function Item() {
  return (
    <div className="mt-[18px] flex min-h-[22px] items-center">
      <div className="flex shrink-0">
        <p className="text-sm text-muted-foreground">팔로우 0명</p>
      </div>
    </div>
  );
};
