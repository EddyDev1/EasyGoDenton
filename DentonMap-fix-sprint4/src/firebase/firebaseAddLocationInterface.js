/**
 * Add location Interface for writing to firestore repository
 * 
 * March 23, 2024 
 * Alexander Evans
 */

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { writeLocationToFirestore } from "./firebaseRepository";
import auth from "./firebaseAuthenticationClass";

export const addLocationInterface = (latitude, longitude) => {
return new Promise ( (resolve) => {
    onAuthStateChanged(auth.myauth, (user) => {
        // If user is valid and not anonymous
        if (user && !user.isAnonymous) {
            // Write location to firestore
            writeLocationToFirestore(latitude, longitude)
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