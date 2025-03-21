/**
 * Firebase Setup Verification Script
 * 
 * This script tests your Firebase configuration by:
 * 1. Initializing the Firebase Admin SDK
 * 2. Connecting to Firestore
 * 3. Attempting to read from the USERS collection
 * 
 * Run with: npx ts-node scripts/verify-firebase.ts
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { db } from '../config/firebaseConfig';

// Load environment variables
dotenv.config();

async function verifyFirebaseSetup() {
  console.log('🔍 Verifying Firebase setup...');
  
  try {
    // Check if Firebase was initialized correctly
    if (!admin.apps.length) {
      throw new Error('Firebase Admin SDK failed to initialize');
    }
    
    console.log('✅ Firebase Admin SDK initialized successfully');
    
    // Check Firestore connection by reading from USERS collection
    console.log('🔍 Attempting to read from USERS collection...');
    const snapshot = await db.collection('USERS').limit(1).get();
    
    if (snapshot.empty) {
      console.log('⚠️  USERS collection exists but is empty. This is fine for new setups.');
      console.log('   You can add test data using the instructions in README.md');
    } else {
      console.log('✅ Successfully connected to Firestore and read from USERS collection');
      console.log('📄 Found document:', snapshot.docs[0].id);
    }
    
    console.log('\n✅ Firebase setup verification completed successfully!');
    console.log('You can now run the API server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Firebase setup verification failed!');
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      // Provide helpful advice based on common errors
      if (error.message.includes('credential')) {
        console.error('\n🔑 Credential Error:');
        console.error('1. Make sure serviceAccountKey.json exists in your project root');
        console.error('2. Verify GOOGLE_APPLICATION_CREDENTIALS in your .env file points to the correct path');
        console.error('3. Check that your service account has the necessary permissions');
      } else if (error.message.includes('permission_denied')) {
        console.error('\n🔒 Permission Denied:');
        console.error('1. Check your Firestore security rules in the Firebase Console');
        console.error('2. Verify your service account has the necessary permissions');
        console.error('3. For testing, you can set security rules to allow all access (not for production!)');
      } else if (error.message.includes('USERS')) {
        console.error('\n📁 Collection Error:');
        console.error('1. Make sure you\'ve created the USERS collection in Firestore');
        console.error('2. Follow the instructions in README.md to create the collection and add a test document');
      }
    }
    
    console.error('\nFor detailed setup instructions, see:');
    console.error('- README.md for overall project setup');
    console.error('- FIREBASE-CREDENTIALS.md for credential setup');
  }
}

// Run the verification
verifyFirebaseSetup(); 