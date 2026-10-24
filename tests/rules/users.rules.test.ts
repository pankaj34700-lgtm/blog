// @vitest-environment node
import { readFileSync } from 'node:fs';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'blog-4b891',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

function ownerDb() {
  return testEnv.authenticatedContext('alice').firestore();
}

function otherDb() {
  return testEnv.authenticatedContext('bob').firestore();
}

function anonymousDb() {
  return testEnv.unauthenticatedContext().firestore();
}

function profilePayload() {
  return {
    displayName: 'Alice',
    email: 'alice@example.com',
    photoURL: null,
    provider: 'google',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
}

async function seedAlice() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users', 'alice'), {
      displayName: 'Alice',
      email: 'alice@example.com',
      photoURL: null,
      provider: 'google',
      createdAt: new Date('2026-10-01T00:00:00Z'),
      lastLoginAt: new Date('2026-10-01T00:00:00Z'),
    });
  });
}

describe('users/{uid} rules', () => {
  it('TC-220 lets the owner read their document', async () => {
    await seedAlice();
    await assertSucceeds(getDoc(doc(ownerDb(), 'users', 'alice')));
  });

  it('TC-221 denies another signed-in user', async () => {
    await seedAlice();
    await assertFails(getDoc(doc(otherDb(), 'users', 'alice')));
  });

  it('TC-222 denies unauthenticated reads', async () => {
    await seedAlice();
    await assertFails(getDoc(doc(anonymousDb(), 'users', 'alice')));
  });

  it('TC-223 lets the owner create their document', async () => {
    await assertSucceeds(setDoc(doc(ownerDb(), 'users', 'alice'), profilePayload()));
  });

  it('TC-224 denies creating a document for another uid', async () => {
    await assertFails(setDoc(doc(otherDb(), 'users', 'alice'), profilePayload()));
  });

  it('TC-225 lets the owner update mutable fields', async () => {
    await seedAlice();
    await assertSucceeds(
      updateDoc(doc(ownerDb(), 'users', 'alice'), {
        displayName: 'Alice B',
        lastLoginAt: serverTimestamp(),
      }),
    );
  });

  it('TC-226 denies changing createdAt and deleting', async () => {
    await seedAlice();

    await assertFails(
      updateDoc(doc(ownerDb(), 'users', 'alice'), {
        createdAt: new Date('2020-01-01T00:00:00Z'),
      }),
    );

    await assertFails(deleteDoc(doc(ownerDb(), 'users', 'alice')));
  });

  it('denies an invalid provider and missing fields', async () => {
    await assertFails(
      setDoc(doc(ownerDb(), 'users', 'alice'), {
        ...profilePayload(),
        provider: 'password',
      }),
    );

    await assertFails(
      setDoc(doc(ownerDb(), 'users', 'alice'), {
        displayName: 'Alice',
        provider: 'google',
      }),
    );
  });
});
