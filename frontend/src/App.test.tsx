//frontend/src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page with headline', () => {
  render(<App />);
  const headlineElement = screen.getByText(/Connect with the Perfect Influencers/i);
  expect(headlineElement).toBeInTheDocument();
});