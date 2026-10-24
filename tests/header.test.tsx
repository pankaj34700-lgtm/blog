import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from './testUtils';

describe('header', () => {
  it('TC-101 shows the BlogX wordmark linking home', async () => {
    renderApp();

    const brand = screen.getByRole('link', { name: 'BlogX' });
    expect(brand).toBeVisible();
    expect(brand).toHaveAttribute('href', '/');
    await screen.findByRole('link', { name: 'Sign in' });
  });

  it('TC-102 shows Sign in pointing at /signin and no Sign up', async () => {
    renderApp();

    const signIn = await screen.findByRole('link', { name: 'Sign in' });
    expect(signIn).toBeVisible();
    expect(signIn).toHaveAttribute('href', '/signin');
    expect(screen.queryByRole('link', { name: 'Sign up' })).not.toBeInTheDocument();
  });

  it('TC-103 reaches BlogX then Sign in by keyboard', async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByRole('link', { name: 'Sign in' });

    await user.tab();
    expect(screen.getByRole('link', { name: 'BlogX' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveFocus();
  });
});
