import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from './testUtils';

describe('routing', () => {
  it('TC-123 renders the Sign up placeholder with a way home', () => {
    renderApp('/signup');

    expect(screen.getByRole('heading', { level: 1, name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/');
  });

  it('TC-124 renders a not-found page for unknown routes', () => {
    renderApp('/nope');

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/');
  });
});
