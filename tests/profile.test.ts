import { serverTimestamp, type FieldValue } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { buildProfileCreate, buildProfileFields, buildProfileUpdate } from '@/lib/userProfile';
import { testUser } from './testUtils';

function isServerTimestamp(value: unknown): boolean {
  return typeof value === 'object' && value !== null && (value as FieldValue).isEqual(serverTimestamp());
}

describe('profile payloads', () => {
  it('TC-215 creates with createdAt and updates without it', () => {
    const fields = buildProfileFields(testUser);
    expect(fields).toEqual({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      photoURL: 'https://example.com/ada.png',
      provider: 'google',
    });

    const created = buildProfileCreate(testUser);
    expect(isServerTimestamp(created.createdAt)).toBe(true);
    expect(isServerTimestamp(created.lastLoginAt)).toBe(true);

    const updated = buildProfileUpdate(testUser);
    expect(isServerTimestamp(updated.lastLoginAt)).toBe(true);
    expect(updated).not.toHaveProperty('createdAt');
  });

  it('falls back to empty strings and null photo', () => {
    const fields = buildProfileFields({
      uid: 'u2',
      displayName: null,
      email: null,
      photoURL: null,
    });

    expect(fields.displayName).toBe('');
    expect(fields.email).toBe('');
    expect(fields.photoURL).toBeNull();
  });
});
