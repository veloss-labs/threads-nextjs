import React, { useCallback, useEffect, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import { isNullOrUndefined } from '~/utils/assertion';
import { api } from '~/services/trpc/react';
import { Icons } from '~/components/icons';

export default function WhoCanLeaveReplyDialog() {
  const { popup, popupClose } = useLayoutStore();

  const open =
    popup.type === 'WHO_CAN_LEAVE_REPLY' &&
    popup.open &&
    !isNullOrUndefined(popup.meta?.itemId) &&
    !isNullOrUndefined(popup.meta?.initialValue);

  return (
    <Dialog open={open} onOpenChange={popupClose}>
      <DialogContent>
        <WhoCanLeaveReplyDialog.Internal open={open} />
      </DialogContent>
    </Dialog>
  );
}

interface ItemProps {
  open: boolean;
}

WhoCanLeaveReplyDialog.Internal = function Item({ open }: ItemProps) {
  const utils = api.useUtils();

  const { popup } = useLayoutStore();

  const [value, setValue] = useState<string | undefined>();

  const isSameValue = popup?.meta?.initialValue === value;

  const mutation = api.threads.update.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.threads.getFollows.invalidate(),
        utils.threads.getRecommendations.invalidate(),
        utils.threads.getLikes.invalidate(),
        utils.threads.getBookmarks.invalidate(),
      ]);
    },
  });

  const onChange = useCallback((nextValue: string) => {
    setValue(nextValue);
  }, []);

  const onSubmit = useCallback(() => {
    const { initialValue, itemId } = popup.meta ?? {};

    // 값이 같으면 무시
    if (value === initialValue) {
      return;
    }

    if (!itemId) {
      return;
    }

    mutation.mutate({
      threadId: itemId,
      whoCanLeaveComments: value as
        | 'everyone'
        | 'followers'
        | 'mentiones'
        | 'nobody',
    });
  }, [mutation, popup.meta, value]);

  useEffect(() => {
    if (open) {
      setValue(popup.meta?.initialValue ?? 'everyone');
    }

    return () => {
      setValue(undefined);
    };
  }, [open]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>답글을 남길 수 있는 사람</DialogTitle>
      </DialogHeader>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Label htmlFor="everyone">모든사람</Label>
          <RadioGroupItem value="everyone" id="everyone" />
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2 py-4">
          <Label htmlFor="followers">내가 팔로우하는 프로필</Label>
          <RadioGroupItem value="followers" id="followers" />
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2 py-4">
          <Label htmlFor="mentiones">내가 언급한 사람만</Label>
          <RadioGroupItem value="mentiones" id="mentiones" />
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2 py-4">
          <Label htmlFor="nobody">아무도</Label>
          <RadioGroupItem value="nobody" id="nobody" />
        </div>
      </RadioGroup>
      <DialogFooter>
        <Button
          type="button"
          className="w-full"
          disabled={isSameValue || mutation.isPending}
          onClick={onSubmit}
        >
          {mutation.isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          업데이트
        </Button>
      </DialogFooter>
    </>
  );
};
