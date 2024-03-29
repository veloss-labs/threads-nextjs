import React from 'react';
import ProfileEditForm from '~/components/profile/profile-edit-form';
import ProfileEditTitle from '~/components/profile/profile-edit-title';
import { api } from '~/services/trpc/server';

export default async function Page() {
  const session = await api.auth.getRequireSession();

  const initialData = {
    name: session.user.name,
    bio: session.user.profile?.bio ?? '',
    website: session.user.profile?.website ?? '',
  };

  return (
    <div
      className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10"
      data-hydrating-signal
    >
      <ProfileEditTitle />
      <ProfileEditForm
        username={session.user.username}
        initialData={initialData}
      />
    </div>
  );
}
