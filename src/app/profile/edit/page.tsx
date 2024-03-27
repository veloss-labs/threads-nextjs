import React from 'react';
import ProfileEditForm from '~/components/profile/profile-edit-form';
import ProfileEditTitle from '~/components/profile/profile-edit-title';

export default function Page() {
  return (
    <div
      className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10"
      data-hydrating-signal
    >
      <ProfileEditTitle />
      <ProfileEditForm />
    </div>
  );
}
