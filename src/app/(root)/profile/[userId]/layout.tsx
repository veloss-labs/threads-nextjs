import { notFound } from 'next/navigation';
import React from 'react';
import ProfileHeader from '~/components/profile/profile-header';
import { userService } from '~/services/users/user.server';
import ProfileTabsList from '~/components/profile/profile-tabs-list';

interface Props {
  children: React.ReactNode;
  params: {
    userId?: string;
  };
  comments: React.ReactNode;
  reposts: React.ReactNode;
}

export default async function Layout({
  children,
  params,
  comments,
  reposts,
}: Props) {
  if (!params.userId) {
    notFound();
  }

  const data = await userService.getItem(params.userId);
  if (!data) {
    notFound();
  }

  return (
    <>
      <ProfileHeader
        name={data.name}
        username={data.username}
        image={data.image}
      />
      <ProfileTabsList
        comments={comments}
        reposts={reposts}
        threads={children}
      />
    </>
  );
}
