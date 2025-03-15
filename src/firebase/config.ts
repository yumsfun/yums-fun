// Firebase configuration
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, get, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCg0GUo3GZpsGS6mhtTHZuqYq40A3y2ztc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "yums-e0b5d.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://yums-e0b5d-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yums-e0b5d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "yums-e0b5d.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "93120881700",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:93120881700:web:0000000000000000000000",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0000000000"
};

// Log Firebase configuration (without sensitive data)
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasDatabaseURL: !!firebaseConfig.databaseURL,
  hasProjectId: !!firebaseConfig.projectId,
  configComplete: Object.values(firebaseConfig).every(value => !!value)
});

// Initialize Firebase
let app: FirebaseApp;
let db: Database;
let auth: Auth;
let firestore: Firestore;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
  firestore = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Re-throw to prevent usage if initialization fails
}

// Test Firebase connection
export async function testFirebaseConnection() {
  try {
    const testRef = ref(db, 'connectionTest');
    const timestamp = Date.now();
    await set(testRef, { timestamp });
    const snapshot = await get(testRef);
    const data = snapshot.val();
    console.log('Firebase connection test:', {
      success: data?.timestamp === timestamp,
      data
    });
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
}

export { app, db, auth, firestore };