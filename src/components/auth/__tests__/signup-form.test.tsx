import { describe, expect, test, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignupForm from '../signup-form';
import '@testing-library/jest-dom';
import { Suspense } from 'react';

describe('SignupForm', () => {
  beforeEach(() => {
    vi.mock('server-only');
    vi.mock('next/auth');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders SignupForm', () => {
    render(
      <Suspense>
        <SignupForm />
      </Suspense>,
    );

    const signupForm = screen.getByTestId('signup-form');
    expect(signupForm).toBeInTheDocument();

    const username = screen.getByTestId('username');
    expect(username).toBeInTheDocument();

    const password = screen.getByTestId('confirm-password');
    expect(password).toBeInTheDocument();

    const confirmPassword = screen.getByTestId('비밀번호 확인');
    expect(confirmPassword).toBeInTheDocument();

    const signupButton = screen.getByTestId('signup-button');
    expect(signupButton).toBeInTheDocument();
  });
});
