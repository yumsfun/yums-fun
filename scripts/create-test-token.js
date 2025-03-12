// This script adds a test token to the Firebase database
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Create a test token
const createTestToken = async () => {
  try {
    // Reference to the tokens collection
    const tokensRef = ref(db, 'tokens');
    
    // Create a new token reference with auto-generated ID
    const newTokenRef = push(tokensRef);
    
    // Test token data
    const testToken = {
      name: 'Test Token',
      symbol: 'TEST',
      logo: '/tokens/kity.jpg',
      marketCap: 500000,
      priceChange24h: 12.5,
      createdAt: Date.now(),
      creatorAddress: 'TestCreatorAddress123',
      replies: 5
    };
    
    // Set the data
    await set(newTokenRef, testToken);
    
    console.log('Test token created with ID:', newTokenRef.key);
    console.log('Token data:', testToken);
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error('Error creating test token:', error);
    process.exit(1);
  }
};

// Execute the function
createTestToken(); 