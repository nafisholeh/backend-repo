import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Firebase Admin SDK Initialization
 * 
 * The admin SDK allows server-side access to Firebase services.
 * It uses a service account for authentication, which provides
 * admin-level access to your Firebase project.
 * 
 * There are two ways to provide credentials:
 * 1. Using GOOGLE_APPLICATION_CREDENTIALS environment variable (recommended)
 * 2. Explicitly passing the service account credentials
 * 
 * This example uses the first method, where you set GOOGLE_APPLICATION_CREDENTIALS
 * to the path of your service account key JSON file in the .env file.
 */
if (!admin.apps.length) {
  try {
    // Check if we already have an initialized Firebase app to avoid re-initialization
    admin.initializeApp({
      // applicationDefault() looks for the GOOGLE_APPLICATION_CREDENTIALS env variable
      credential: admin.credential.applicationDefault(),
      
      // The database URL is specific to your Firebase project
      // Format: https://<YOUR-PROJECT-ID>.firebaseio.com
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    
    // Provide helpful guidance for common errors
    if (error instanceof Error) {
      if (error.message.includes('credential')) {
        console.error('CREDENTIAL ERROR: Make sure your serviceAccountKey.json file exists and GOOGLE_APPLICATION_CREDENTIALS is set correctly in .env');
      } else if (error.message.includes('databaseURL')) {
        console.error('DATABASE URL ERROR: Make sure FIREBASE_DATABASE_URL is set correctly in .env');
      }
    }
  }
}

// Firestore database instance
// This is the main entry point for all Firestore operations
export const db = admin.firestore();

/**
 * Utility Functions for Firestore Timestamp Conversion
 * 
 * Firestore stores dates as Timestamp objects, but our application uses
 * JavaScript Date objects. These functions help convert between them.
 */

// Convert Firestore timestamp to JavaScript Date
export const timestampToDate = (timestamp: admin.firestore.Timestamp): Date => {
  return timestamp.toDate();
};

// Convert JavaScript Date to Firestore timestamp
export const dateToTimestamp = (date: Date): admin.firestore.Timestamp => {
  return admin.firestore.Timestamp.fromDate(date);
}; 