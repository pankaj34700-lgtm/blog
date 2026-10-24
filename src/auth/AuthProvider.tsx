import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthStatus } from '@/auth/AuthContext';
import {
  AuthFailure,
  firebaseAuthAdapter,
  type AuthAdapter,
  type AuthUser,
} from '@/lib/auth';

interface AuthProviderProps {
  children: ReactNode;
  adapter?: AuthAdapter;
  syncProfile?: (user: AuthUser) => Promise<void>;
  onProfileError?: (error: unknown) => void;
}

// Firestore is only needed after sign-in, so keep it out of the initial bundle.
const defaultSyncProfile = (user: AuthUser) =>
  import('@/lib/userProfile').then(({ syncUserProfile }) => syncUserProfile(user));

export function AuthProvider({
  children,
  adapter = firebaseAuthAdapter,
  syncProfile = defaultSyncProfile,
  onProfileError,
}: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('resolving');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<AuthFailure | null>(null);

  useEffect(() => {
    return adapter.subscribe((nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? 'signedIn' : 'signedOut');

      if (nextUser) {
        syncProfile(nextUser).catch((cause: unknown) => {
          onProfileError?.(cause);
        });
      }
    });
  }, [adapter, syncProfile, onProfileError]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);

    try {
      await adapter.signInWithGoogle();
    } catch (cause) {
      setError(
        cause instanceof AuthFailure
          ? cause
          : new AuthFailure('unknown', 'Something went wrong while signing in. Please try again.'),
      );
    }
  }, [adapter]);

  const signOut = useCallback(async () => {
    await adapter.signOut();
  }, [adapter]);

  const value = useMemo(
    () => ({ status, user, error, signInWithGoogle, signOut }),
    [status, user, error, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
