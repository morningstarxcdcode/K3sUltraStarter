import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Home page with backend message', async () => {
  render(<App />);
  const heading = await screen.findByText(/Sample React Frontend/i);
  expect(heading).toBeInTheDocument();
});

test('renders About page', () => {
  render(<App />);
  const heading = screen.getByText(/About/i);
  expect(heading).toBeInTheDocument();
});
