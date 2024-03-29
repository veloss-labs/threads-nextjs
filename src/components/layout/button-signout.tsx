import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signOutAction } from '~/services/users/users.action';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';

export default function ButtonSignout() {
  const [_, formAction] = useFormState(signOutAction, undefined);

  return (
    <form action={formAction} className="w-full text-left">
      <ButtonSubmit />
    </form>
  );
}

function ButtonSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-auto w-full justify-start space-x-2 p-0"
      variant="ghost"
      disabled={pending}
      size="sm"
    >
      {pending ? <Icons.spinner className="animate-spin" /> : null}
      <span>로그아웃</span>
    </Button>
  );
}
