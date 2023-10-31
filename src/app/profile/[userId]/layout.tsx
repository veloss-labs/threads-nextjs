import React from 'react';
import ProfileHeader from '~/components/profile/profile-header';

interface Props {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default function Layout({ children, params }: Props) {
  console.log(params);
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
