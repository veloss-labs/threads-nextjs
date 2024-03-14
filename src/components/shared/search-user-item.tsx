import React, { useTransition } from 'react';
import Avatars from '~/components/shared/avatars';
import { Button } from '~/components/ui/button';
import { UserSelectSchema } from '~/services/db/selectors/users';

interface UserItemProps {
  item: UserSelectSchema;
}

export default function UserItem({ item }: UserItemProps) {
  const [isPending, startTransition] = useTransition();

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
