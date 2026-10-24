import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from './testUtils';

describe('header', () => {
  it('TC-101 shows the BlogX wordmark linking home', () => {
    renderApp();

    const brand = screen.getByRole('link', { name: 'BlogX' });
    expect(brand).toBeVisible();
    expect(brand).toHaveAttribute('href', '/');
  });

  it('TC-102 shows a Sign up link to /signup', () => {
    renderApp();

    const signUp = screen.getByRole('link', { name: 'Sign up' });
    expect(signUp).toBeVisible();
    expect(signUp).toHaveAttribute('href', '/signup');
  });

  it('TC-103 reaches BlogX then Sign up by keyboard', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.tab();
    expect(screen.getByRole('link', { name: 'BlogX' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveFocus();
  });
});
