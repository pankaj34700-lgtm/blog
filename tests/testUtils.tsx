import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '@/App';
import { AuthProvider } from '@/auth/AuthProvider';
import type { AuthAdapter, AuthUser } from '@/lib/auth';

type Listener = (user: AuthUser | null) => void;
export type EmitUser = (user: AuthUser | null) => void;

interface FakeAuthOptions {
  initialUser?: AuthUser | null;
  signIn?: (emit: EmitUser) => Promise<void>;
  signOut?: (emit: EmitUser) => Promise<void>;
  resolveOnSubscribe?: boolean;
}

export function createAuthAdapter(options: FakeAuthOptions = {}) {
  let listener: Listener | null = null;

  const emit: EmitUser = (user) => {
    listener?.(user);
  };

  const adapter: AuthAdapter = {
    signInWithGoogle: () => (options.signIn ? options.signIn(emit) : Promise.resolve()),
    signOut: () => (options.signOut ? options.signOut(emit) : Promise.resolve()),
    subscribe(next) {
      listener = next;
      if (options.resolveOnSubscribe !== false) {
        next(options.initialUser ?? null);
      }
      return () => {
        listener = null;
      };
    },
  };

  return { adapter, emit };
}

interface RenderAppOptions {
  adapter?: AuthAdapter;
  syncProfile?: (user: AuthUser) => Promise<void>;
  onProfileError?: (error: unknown) => void;
}

export function renderApp(path = '/', options: RenderAppOptions = {}) {
  const adapter = options.adapter ?? createAuthAdapter().adapter;

  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider
        adapter={adapter}
        syncProfile={options.syncProfile ?? (async () => {})}
        onProfileError={options.onProfileError}
      >
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

export const testUser: AuthUser = {
  uid: 'user-1',
  displayName: 'Ada Lovelace',
  email: 'ada@example.com',
  photoURL: 'https://example.com/ada.png',
};
