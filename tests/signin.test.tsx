import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createAuthAdapter, renderApp, testUser } from './testUtils';

describe('sign-in page', () => {
  it('TC-205 shows one heading and one Google action', async () => {
    renderApp('/signin');

    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
  });

  it('TC-206/TC-207 starts sign-in once and lands on the home page', async () => {
    const user = userEvent.setup();
    const signIn = vi.fn(async (emit: (user: typeof testUser | null) => void) => {
      emit(testUser);
    });
    const { adapter } = createAuthAdapter({ signIn });
    renderApp('/signin', { adapter });

    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Latest stories' })).toBeInTheDocument();
    expect(signIn).toHaveBeenCalledTimes(1);
  });
});
