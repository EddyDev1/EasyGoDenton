/**
 * Read and writes to the database
 * Requires user authentication to write to database
 * 
 * April 15, 2024
 * Alexander Evans
 * Refractored writeLocationToFirestore() to correctly add a PinLocation object
 * 
 * April 14, 2024
 * Alexander Evans
 * Changelog:
 * > Added a batchWrite() function that writes the current locations array to firebase
 */

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, DocumentReference, addDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfiguration';
// Shape and User structs meant for PinLocation, is empty
import { shape, user } from './firebaseLocationStructs';
// imports default class Location
// use getRecord() to create a record to write to the database
import PinLocation from './firebaseLocationClass'; 
import auth from './firebaseAuthenticationClass';

/**
 * Writes a location to firestore under the locations collection and the user collection using uid native to firestore
 * Returns true or false if succedded
 * @param {*} latitude latitude of a location
 * @param {*} longitude longitude of a location
 * @param {*} type the type of location: undefined, parking, or accessible entrance
 * @param {*} the group this location belongs to (if it is forming a shape)
 * @param {string} 
 */
export const writeLocationToFirestore = (latitude, longitude) => {
    return new Promise ( (resolve) => {
        
        onAuthStateChanged(auth.myauth, (user) => {
            if (user && !user.isAnonymous) {
                var userid = user.uid;
                // set the user id for the location object
                const location_Object = new PinLocation(latitude, longitude);
                location_Object.set_userid(userid);
                // Creates a record for the location object
                const location = location_Object.createRecord();
                // Get the locations 
                const locationCollection = collection(firestoreDb, `locations`);

                // Add the location to a document in the locations collection and log the document id
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
        onAuthStateChanged(auth.myauth, (user) => {
            if (user) {
                const locations = [];
                // Get the collection of locations for the current user.
                const locationCollection = collection(firestoreDb, `locations`);
                // Get all location documents from the locations collection.
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
 * @param {[PinLocation]} locations array of the locations 
 * @returns 
 */
export const deleteLocationFromFirestore = (locationid, locations, index) => {
    return new Promise( (resolve) => {
        onAuthStateChanged(auth.myauth, (user) => {
            if (user) {
                const docReference = doc(firestoreDb, `locations/${locationid}`);

                deleteDoc(docReference)
                    .then( () => {
                        console.log(`The location with an id of ${locationid} has been deleted successfully`);
                        locations[index] = null;
                        resolve();
                    })
                    .catch( (error) => {
                        console.log(`There was an error while trying to delete location with id ${locationid}.`, error);
                        resolve();
                    });
            }
        });
    });
}

/**
 * Writes all the current PinLocations to the database through internal class functions
 * @param {[PinLocation]} locations the location array containing PinLocation objects
 * @throws if locations is null, then an error is thrown
 */
export const batchWrite = (locations) => {
    // Breakpoint - throws if locations is null
    if (!locations) {
        throw new Error("batchWrite() : locations is null");
    }

    onAuthStateChanged(auth.myauth, (user) => {
        if (!user || user.isAnonymous) {
            console.error("User is not logged in: batchWrite()");
            return;
        }

        locations.forEach( (obj) => {
            obj.writeRecordToFirestore();
        });
    })
}