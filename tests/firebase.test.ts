import { getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  REQUIRED_FIREBASE_ENV_KEYS,
  createFirebaseApp,
  firebaseApp,
  readFirebaseConfig,
  type FirebaseEnv,
} from '@/lib/firebase';
import { db } from '@/lib/firestore';
import { storage } from '@/lib/storage';

const validEnv: FirebaseEnv = {
  VITE_FIREBASE_API_KEY: 'api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'blog-4b891.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'blog-4b891',
  VITE_FIREBASE_STORAGE_BUCKET: 'blog-4b891.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  VITE_FIREBASE_APP_ID: '1:000000000000:web:test-app',
};

describe('firebase configuration', () => {
  it('TC-141 creates one app for blog-4b891 with db and storage', () => {
    expect(readFirebaseConfig(validEnv).projectId).toBe('blog-4b891');

    const first = createFirebaseApp(validEnv);
    const second = createFirebaseApp(validEnv);

    expect(second).toBe(first);
    expect(getApps()).toHaveLength(1);
    expect(firebaseApp.options.projectId).toBe('blog-4b891');
    expect(getFirestore(firebaseApp)).toBe(db);
    expect(getStorage(firebaseApp)).toBe(storage);
  });

  it('TC-142 names the missing variable and fails fast', () => {
    const incomplete: FirebaseEnv = { ...validEnv, VITE_FIREBASE_APP_ID: '' };

    expect(() => readFirebaseConfig(incomplete)).toThrow(/VITE_FIREBASE_APP_ID/);
    expect(() => readFirebaseConfig({})).toThrow(/VITE_FIREBASE_API_KEY/);
  });

  it('TC-143 documents every key and ignores the local env file', () => {
    const root = process.cwd();
    const example = readFileSync(join(root, '.env.example'), 'utf8');
    const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');

    for (const key of REQUIRED_FIREBASE_ENV_KEYS) {
      expect(example).toContain(`${key}=`);
    }
    expect(example).toContain('VITE_FIREBASE_PROJECT_ID=blog-4b891');
    expect(gitignore).toMatch(/^\.env\.local$/m);
  });
});
