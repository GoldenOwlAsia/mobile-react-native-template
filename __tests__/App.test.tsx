/**
 * @format
 */

import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react-native';

import App from '../App';

afterEach(() => {
  cleanup();
});

test('renders after store hydration', async () => {
  const { getByText } = render(<App />);

  await waitFor(() => {
    expect(getByText('Sign In')).toBeTruthy();
  });
});
