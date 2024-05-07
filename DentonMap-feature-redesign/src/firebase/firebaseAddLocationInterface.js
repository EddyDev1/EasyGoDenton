/**
 * Add location Interface for writing to firestore repository
 * 
 * March 23, 2024 
 * Alexander Evans
 */

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { writeLocationToFirestore } from "./firebaseRepository";
import auth from "./firebaseAuthenticationClass";

/**
 * Adds a location using write to firebase for batch and manual add location
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} type 
 * @param {*} group 
 * @returns 
 */
export const addLocationInterface = (latitude, longitude, type, group) => {
return new Promise ( (resolve) => {
    onAuthStateChanged(auth.myauth, (user) => {
        // If user is valid and not anonymous
        if (user && !user.isAnonymous) {
            // Write location to firestore
            writeLocationToFirestore(latitude, longitude, type, group)
            .then ( () => {
                resolve ();
            });
        }
        else {
            console.log("No authenticated user detected.\n");
            const errorMessage = document.getElementById('add-location-error-message');
            errorMessage.style.display = 'inline-block';
            throw new Error("Must be signed in");
        }
    });
});
}