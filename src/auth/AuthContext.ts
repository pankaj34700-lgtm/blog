import { createContext } from 'react';
import type { AuthFailure, AuthUser } from '@/lib/auth';

export type AuthStatus = 'resolving' | 'signedOut' | 'signedIn';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  error: AuthFailure | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
