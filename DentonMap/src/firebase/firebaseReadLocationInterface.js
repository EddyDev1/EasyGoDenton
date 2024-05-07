/**
 * Read location Interface for reading from firestore repository
 * 
 * March 25, 2024
 * Alexander Evans
 * Edward Asante
 */

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { readLocationsFromFirestore } from "./firebaseRepository";

export const readLocationInterface = (id) => {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous)
      {
        readLocationsFromFirestore()
        .then((locations) => {
          resolve(locations);
        });
        /*        
        .then( (locations) => {
          locations.forEach( (location) => {
            let coords;
            if (location.id === id)
            {
              coords = {
                lat: location.latitude,
                lng: location.longitude
              }
            }
            resolve(coords);
          })
        })
        .catch( (err) => {
          console.error('Error: ', err);
        });
        */
      }
      else
      {
        throw new Error("Invalid read");
      }
    });
  });
}