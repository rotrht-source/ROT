import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the specific provisioned databaseId
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export default app;
