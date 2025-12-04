import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MovieSeek header and search', () => {
  render(<App />);
  const header = screen.getByTestId("header");
  expect(header).toHaveTextContent("MovieSeek");

  const search = screen.getByTestId('search');
  expect(search).toBeInTheDocument();
});
