import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseApp } from '@/lib/firebase';

/** Imported by future upload features only; keeps Storage out of the initial bundle. */
export const storage: FirebaseStorage = getStorage(firebaseApp);
