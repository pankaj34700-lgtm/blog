import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseApp } from '@/lib/firebase';

/**
 * Firestore is imported lazily by the profile sync, so this module never lands
 * in the initial bundle.
 */
export const db: Firestore = getFirestore(firebaseApp);
