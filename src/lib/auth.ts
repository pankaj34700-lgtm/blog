import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type AuthFailureCode =
  | 'popup-blocked'
  | 'cancelled'
  | 'network'
  | 'unauthorized-domain'
  | 'operation-not-allowed'
  | 'unknown';

export class AuthFailure extends Error {
  readonly code: AuthFailureCode;

  constructor(code: AuthFailureCode, message: string) {
    super(message);
    this.name = 'AuthFailure';
    this.code = code;
  }
}

const MESSAGES: Record<AuthFailureCode, string> = {
  'popup-blocked': 'The sign-in window was blocked by your browser.',
  cancelled: '',
  network: 'Network problem while signing in. Check your connection and try again.',
  'unauthorized-domain': 'This domain is not authorized for sign-in yet.',
  'operation-not-allowed': 'Google sign-in is not enabled for this project yet.',
  unknown: 'Something went wrong while signing in. Please try again.',
};

function firebaseCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return '';
}

export function classifyAuthFailure(error: unknown): AuthFailureCode {
  switch (firebaseCode(error)) {
    case 'auth/popup-blocked':
      return 'popup-blocked';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'cancelled';
    case 'auth/network-request-failed':
      return 'network';
    case 'auth/unauthorized-domain':
      return 'unauthorized-domain';
    case 'auth/operation-not-allowed':
      return 'operation-not-allowed';
    default:
      return 'unknown';
  }
}

export function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}

/** The only module allowed to import `firebase/auth`. */
export interface AuthAdapter {
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  subscribe(listener: (user: AuthUser | null) => void): () => void;
}

export function createFirebaseAuthAdapter(auth: Auth = getAuth(firebaseApp)): AuthAdapter {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  return {
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        const code = classifyAuthFailure(error);

        if (code === 'popup-blocked') {
          await signInWithRedirect(auth, provider);
          return;
        }

        if (code === 'cancelled') {
          return;
        }

        throw new AuthFailure(code, MESSAGES[code]);
      }
    },

    async signOut() {
      await signOut(auth);
    },

    subscribe(listener) {
      return onAuthStateChanged(auth, (user) => listener(user ? toAuthUser(user) : null));
    },
  };
}

export const firebaseAuthAdapter = createFirebaseAuthAdapter();
