/**
 * Read and writes to the database
 * Might require user authentication
 * 
 * Changelog:
 * March 23, 2024
 * Alexander Evans
 * Added a location interface (for add location) to refresh the page and keep writeToFirebase seperate due to 
 * the aformentioned function being used with maps.js
 * 
 * 
 * March 22, 2024
 * Alexander Evans
 * > Added a isAnonymous check
 * 
 * March 22, 2024
 * Alexander Evans
 */

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, DocumentReference, addDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfiguration';
// imports default class Location
// use getRecord() to create a record to write to the database
import Location from './firebaseLocationClass'; 

/**
 * Writes a location to firestore under the locations collection and the user collection using uid native to firestore
 * Returns true or false if succedded
 * @param {*} latitude latitude of a location
 * @param {*} longitude longitude of a location
 */
export const writeLocationToFirestore = (latitude, longitude) => {
    return new Promise ( (resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user && !user.isAnonymous) {
                var userid = user.uid;
                // set the user id for the location object
                const location_Object = new Location(latitude, longitude, user.uid);
                // Creates a record for the location object
                const location = location_Object.createRecord();
                // Get the locations 
                const locationCollection = collection(firestoreDb, `locations`);

                // Add the song to a document in the songs collection and log the document id
                addDoc(locationCollection, location)
                    .then( (docRef) => {
                        console.log('Location document Id: ', docRef.id);
                        // Add location to the user
                        const userCollection = collection(firestoreDb, `users/${user.uid}/locations`);
                        // Adds the locationid to the location object
                        location_Object.locationid = docRef.id;
                        // Adds the document id to the user's saved locations
                        addDoc(userCollection, location_Object.getid())
                        // Log a success
                        .then( (userDocRef) => { 
                            console.log(`Location userdoc id: `, userDocRef.id);
                        })
                        // error catching with writing to the user firestore
                        .catch( (error) => console.error("There was an error with adding the userlocation to firestore: ", error));
                    })
                    // error catching with writing to the location firestore
                    .catch( (error) => {
                        console.error('There was an error while writing a location to firestore: ', error)
                    });
            }
            else {
                console.error("User is not logged in.");
            }
        });

        resolve();
    });
}

/**
 * Gets all locations from firestore to be dynamically written onto the DOM.
 * @returns a promise containing the locations
 */
export const readLocationsFromFirestore = () => {
    return new Promise((resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const locations = [];
                // Get the collection of songs for the current user.
                const locationCollection = collection(firestoreDb, `locations`);
                // Get all song documents from the song collection.
                getDocs(locationCollection)
                    .then( (querySnapshot) => {
                        querySnapshot.forEach( (doc) => {
                            const locationData = { ...doc.data(), id: doc.id };
                            locations.push(locationData);
                        });
                        resolve(locations);
                    });
            }
        })
    })

}

/**
 * Allows any user to delete a listed location from firestore
 * @param {*} locationid
 * @returns 
 */
export const deleteLocationFromFirestore = (locationid) => {
    return new Promise( (resolve) => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const docReference = doc(firestoreDb, `locations/${locationid}`);

                deleteDoc(docReference)
                    .then( () => {
                        console.log(`The song with an id of ${locationid} has been deleted successfully`);
                        resolve();
                    })
                    .catch( (error) => {
                        console.log(`There was an error while trying to delete song with id ${locationid}.`, error);
                        resolve();
                    });
            }
        });
    });
}

