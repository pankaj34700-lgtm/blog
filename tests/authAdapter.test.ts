import { beforeEach, describe, expect, it, vi } from 'vitest';

const firebaseAuth = vi.hoisted(() => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
  getAuth: () => ({}),
  onAuthStateChanged: firebaseAuth.onAuthStateChanged,
  signInWithPopup: firebaseAuth.signInWithPopup,
  signInWithRedirect: firebaseAuth.signInWithRedirect,
  signOut: firebaseAuth.signOut,
}));

vi.mock('@/lib/firebase', () => ({ firebaseApp: {} }));

import { AuthFailure, classifyAuthFailure, createFirebaseAuthAdapter } from '@/lib/auth';

const auth = {} as never;

describe('auth adapter', () => {
  beforeEach(() => {
    firebaseAuth.signInWithPopup.mockReset();
    firebaseAuth.signInWithRedirect.mockReset();
  });

  it('signs in through the popup when it works', async () => {
    firebaseAuth.signInWithPopup.mockResolvedValue({ user: { uid: 'u1' } });

    await createFirebaseAuthAdapter(auth).signInWithGoogle();

    expect(firebaseAuth.signInWithPopup).toHaveBeenCalledTimes(1);
    expect(firebaseAuth.signInWithRedirect).not.toHaveBeenCalled();
  });

  it('TC-208 falls back to redirect when the popup is blocked', async () => {
    firebaseAuth.signInWithPopup.mockRejectedValue({ code: 'auth/popup-blocked' });
    firebaseAuth.signInWithRedirect.mockResolvedValue(undefined);

    await expect(createFirebaseAuthAdapter(auth).signInWithGoogle()).resolves.toBeUndefined();

    expect(firebaseAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('TC-209 stays silent when the user closes the popup', async () => {
    firebaseAuth.signInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });

    await expect(createFirebaseAuthAdapter(auth).signInWithGoogle()).resolves.toBeUndefined();
    expect(firebaseAuth.signInWithRedirect).not.toHaveBeenCalled();
  });

  it('TC-210 maps network and provider failures to AuthFailure', async () => {
    firebaseAuth.signInWithPopup.mockRejectedValue({ code: 'auth/network-request-failed' });

    await expect(createFirebaseAuthAdapter(auth).signInWithGoogle()).rejects.toMatchObject({
      name: 'AuthFailure',
      code: 'network',
    });
  });

  it('classifies unknown errors as unknown', () => {
    expect(classifyAuthFailure(new Error('nope'))).toBe('unknown');
    expect(classifyAuthFailure({ code: 'auth/operation-not-allowed' })).toBe('operation-not-allowed');
    expect(new AuthFailure('unknown', 'x').message).toBe('x');
  });
});
