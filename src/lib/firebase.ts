import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export const REQUIRED_FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export type FirebaseEnvKey = (typeof REQUIRED_FIREBASE_ENV_KEYS)[number];
export type FirebaseEnv = Partial<Record<FirebaseEnvKey, string | undefined>>;

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Reads the Firebase web config from `VITE_FIREBASE_*` values and fails loudly
 * on the first missing key so a blank page never hides a setup mistake.
 */
export function readFirebaseConfig(env: FirebaseEnv): FirebaseClientConfig {
  const missing = REQUIRED_FIREBASE_ENV_KEYS.filter((key) => !env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(', ')}. ` +
        'Copy .env.example to .env.local and fill in the values from the Firebase console.',
    );
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY as string,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: env.VITE_FIREBASE_APP_ID as string,
  };
}

/** Reuses the existing app so Vite hot reload never registers a duplicate. */
export function createFirebaseApp(env: FirebaseEnv = import.meta.env): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(readFirebaseConfig(env));
}

export const firebaseApp: FirebaseApp = createFirebaseApp();
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);
