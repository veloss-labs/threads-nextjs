import React from 'react';
import type { Metadata } from 'next';
import AuthForm from '~/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function Page() {
  return <AuthForm />;
}
