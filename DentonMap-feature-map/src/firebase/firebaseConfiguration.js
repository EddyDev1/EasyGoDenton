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
    apiKey: "AIzaSyAHNcfAL_16FNmmg7ZGfcv9KKMSMpA42no",
    authDomain: "denton-1cade.firebaseapp.com",
    databaseURL: "https://denton-1cade-default-rtdb.firebaseio.com",
    projectId: "denton-1cade",
    storageBucket: "denton-1cade.appspot.com",
    messagingSenderId: "844799469148",
    appId: "1:844799469148:web:59267f15ea5a461fb9a899",
    measurementId: "G-2HZ4JEHDDZ"
};

// Firebase app
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Database object
export const firestoreDb = getFirestore(app);
export const database = getDatabase(app);
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries 