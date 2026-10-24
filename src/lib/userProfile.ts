import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { AuthUser } from '@/lib/auth';
import { db } from '@/lib/firestore';

export function buildProfileFields(user: AuthUser) {
  return {
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    photoURL: user.photoURL ?? null,
    provider: 'google' as const,
  };
}

/** Update payload: never touches `createdAt`. */
export function buildProfileUpdate(user: AuthUser) {
  return {
    ...buildProfileFields(user),
    lastLoginAt: serverTimestamp(),
  };
}

/** Create payload used only when the document does not exist yet. */
export function buildProfileCreate(user: AuthUser) {
  return {
    ...buildProfileFields(user),
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
}

/**
 * Best-effort profile sync. Authentication is authoritative; a failed write must
 * never block or roll back the signed-in UI.
 */
export async function syncUserProfile(user: AuthUser): Promise<void> {
  const reference = doc(db, 'users', user.uid);

  try {
    await updateDoc(reference, buildProfileUpdate(user));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'not-found') {
      await setDoc(reference, buildProfileCreate(user));
      return;
    }

    throw error;
  }
}
