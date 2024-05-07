/**
 * Sign out function for signing users out of firebase
 * Done by clicking the sign out button
 * relies on assignClick in utilities
 * 
 * March 13, 2024
 * Alexander Evans
 * 
 * Exports:
 * > signOut()
 */

import { getAuth } from "firebase/auth";

export const signOut = () => {
    const auth = getAuth();
    auth.languageCode = 'it';
    auth.signOut()
        .then(() => {
            console.log('User successfully signed out');
            window.location.href = 'index.html';
        })
        .catch( (error) => {
            console.error('There was an error when signing out: ', error);
        });
}