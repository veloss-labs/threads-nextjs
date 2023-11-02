import { useQueryClient } from '@tanstack/react-query';
import React, { useTransition } from 'react';
import Avatars from '~/components/shared/avatars';
import { Button } from '~/components/ui/button';
import { useKeyContext } from '~/libs/providers/key';
import type { SearchItemSchema } from '~/services/search/search.model';

interface UserItemProps {
  item: SearchItemSchema;
}

export default function UserItem({ item }: UserItemProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { queryKey } = useKeyContext();

  const onClickFollow = () => {
    // TODO: follow
    startTransition(async () => {
      // await likeThread({
      //   threadId: item.id,
      //   isLike: item.isLiked,
      // });
      // await queryClient.invalidateQueries({
      //   queryKey,
      // });
    });
  };

  return (
    <div className="m-3 flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatars
          // src={item.user?.image ?? undefined}
          src={undefined}
          alt={`${item?.username} profile picture`}
          fallback="T"
        />
        <div>
          <p className="text-sm font-medium leading-none">{item?.username}</p>
          <p className="text-sm text-muted-foreground">팔로우 0명</p>
        </div>
      </div>
      <Button variant="outline" className="ml-auto">
        팔로우
      </Button>
    </div>
  );
}
