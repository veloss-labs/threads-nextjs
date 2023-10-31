import { notFound } from 'next/navigation';
import React from 'react';
import ProfileHeader from '~/components/profile/profile-header';
import { userService } from '~/services/users/user.server';

interface Props {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default async function Layout({ children, params }: Props) {
  if (!params.userId) {
    notFound();
  }

  const data = await userService.get(params.userId);
  if (!data) {
    notFound();
  }

  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
