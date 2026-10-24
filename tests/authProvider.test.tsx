import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthFailure } from '@/lib/auth';
import { createAuthAdapter, renderApp, testUser } from './testUtils';

describe('auth provider and header', () => {
  it('TC-203 shows a skeleton while auth is resolving', () => {
    const { adapter } = createAuthAdapter({ resolveOnSubscribe: false });
    renderApp('/', { adapter });

    expect(screen.getByRole('status', { name: 'Checking sign-in status' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('TC-201 settles into the signed-out header', async () => {
    renderApp();

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('TC-202 shows avatar, name, and Sign out for a signed-in user', async () => {
    const { adapter } = createAuthAdapter({ initialUser: testUser });
    renderApp('/', { adapter });

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada Lovelace avatar' })).toHaveAttribute(
      'src',
      'https://example.com/ada.png',
    );
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('TC-212 exposes an existing session without a signed-out frame', async () => {
    const emitLater = createAuthAdapter({ resolveOnSubscribe: false });
    renderApp('/', { adapter: emitLater.adapter });

    expect(screen.getByRole('status', { name: 'Checking sign-in status' })).toBeInTheDocument();

    await act(async () => {
      emitLater.emit(testUser);
    });

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('TC-214 reflects profile updates', async () => {
    const { adapter, emit } = createAuthAdapter({ initialUser: testUser });
    renderApp('/', { adapter });

    await screen.findByText('Ada Lovelace');

    await act(async () => {
      emit({ ...testUser, displayName: 'Ada Byron', photoURL: 'https://example.com/new.png' });
    });

    expect(screen.getByText('Ada Byron')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada Byron avatar' })).toHaveAttribute(
      'src',
      'https://example.com/new.png',
    );
  });

  it('TC-213 signs out and restores the signed-out header', async () => {
    const user = userEvent.setup();
    const emitLater = createAuthAdapter({
      initialUser: testUser,
      signOut: async (emit) => emit(null),
    });
    renderApp('/', { adapter: emitLater.adapter });

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });

  it('TC-215 syncs the profile on sign-in', async () => {
    const syncProfile = vi.fn(async () => {});
    const { adapter } = createAuthAdapter({ initialUser: testUser });
    renderApp('/', { adapter, syncProfile });

    await screen.findByText('Ada Lovelace');

    expect(syncProfile).toHaveBeenCalledWith(testUser);
  });

  it('TC-216 keeps the signed-in UI when the profile write fails', async () => {
    const onProfileError = vi.fn();
    const syncProfile = vi.fn(async () => {
      throw new Error('firestore down');
    });
    const { adapter } = createAuthAdapter({ initialUser: testUser });
    renderApp('/', { adapter, syncProfile, onProfileError });

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(onProfileError).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('failures', () => {
  it('TC-210 surfaces a provider failure on the sign-in page', async () => {
    const user = userEvent.setup();
    const { adapter } = createAuthAdapter({
      signIn: async () => {
        throw new AuthFailure('network', 'Network problem while signing in.');
      },
    });
    renderApp('/signin', { adapter });

    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Network problem while signing in.');
  });

  it('TC-209 shows no error for a cancelled popup', async () => {
    const user = userEvent.setup();
    renderApp('/signin');

    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
