import React from 'react';
import type { Metadata } from 'next';
import AuthForm from '~/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function Page() {
  return <AuthForm />;
}
