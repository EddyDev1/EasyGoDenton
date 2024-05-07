/**
 * Reads the locations from Firestore in Firebase and returns an array of Location objects
 * Mostly a quality of life improvement, still has latitude, longitude, and userid
 * Alexander Evans
 * April 13, 2024
 * 
 * */


import { onAuthStateChanged } from "firebase/auth";
import { firestoreDb } from "./firebaseConfiguration";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import  PinLocation  from "./firebaseLocationClass.js";
import auth from "./firebaseAuthenticationClass.js";
import { anonymousSignin } from "../scripts/login.js";


/**
 * returns the Locations from firestore as an array
 * @returns An array containing the locations from firestore
 */
export const createLocationsFirestore = () => {
    return new Promise ( async (resolve) => {
        // Array of Location objects to return
        let locations = [];
        // Collection reference
        let colRef = null;
        // Path of the collection
        let path = "locations";   

        // Grab the locations collection
        anonymousSignin();
        colRef = query(collection(firestoreDb, path), where("isPinLocation", "==", true));
        // Get the docs from the collection
        await getDocs(colRef)
        .then( (querySnapshot) => {
            querySnapshot.forEach((item) => {
                const data = item.data();
                /* console.log(item.id); */
                const location = new PinLocation(data.latitude, data.longitude, data.desc, item.id, data.username, data.user);
                locations.push(location);
                resolve(locations);
            });
        })
        .catch((error) => {
            console.error("An error has occured with getDocs() in createLocationsFirestore()", error);
            throw error;
        });
    });
}