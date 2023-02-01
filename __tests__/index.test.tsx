import React from 'react';
import { expect, test } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Home from '../src/pages/index';

test('home', async () => {
  render(<Home />);
  const main = within(screen.getByRole('main'));
  expect(main.getByText('Get started by editing')).toBeDefined();
  const code = await main.findByTestId('code');
  expect(code.textContent).toEqual('pages/index.tsx');
});
