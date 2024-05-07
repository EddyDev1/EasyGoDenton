/**
 * Configures firebase objects such as firebasApp and firebaseDb
 * 
 * March 14, 2024
 * Alexander Evans
 */

// imports firebase objects from the local scope.
// firebase is imported in the html
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    /* YOUR CONFIG HERE */
};

// Firebase app
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Database object
export const firestoreDb = getFirestore(app);
export const database = getDatabase(app);
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries 
