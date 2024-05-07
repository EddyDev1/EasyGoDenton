/**
 * Desc: Main javascript file for node.js and front-end
 * 
 * March 12, 2024
 * 
 * Alexander Evans
 * 
 * Changelog:
 * Alexander Evans
 * > Created file
 * > Added assignClick from utilities js
 * > Added registerWindowSignup from register.js which is a refractoring
 * > of Ju's windows.signup function
 */

import { addLocationToMyLocations, assignClick, initializeSigninButtons} from "./utilities.js";
// Dahun Ju's window signup function from register
import { registerWindowSignup  } from "./register.js";
// Ju's handler for email-password login
import { emailPasswordLoginHandler, googleSignin, anonymousSignin } from "./login.js";
// signs users out
import { signOut } from "../firebase/firebaseSignout.js";
// adds lat, long, uid doc to firestore
import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore} from "../firebase/firebaseRepository.js"
// google maps api
import { loadMap } from "./maps.js";

// debugging
console.log("Hello World\n");

// For hiding and showing buttons that rely
// on being signed in or out
initializeSigninButtons();
anonymousSignin();
loadMap();

// Sets the signout button to activate if someone clicks it.
assignClick('appbar-signout-button', signOut);

// Adds listener for windows signup
registerWindowSignup();
// Handler for email-password logins
emailPasswordLoginHandler();

// Google Sign in
assignClick ('signin-google', googleSignin);

// Add location
const createLocationForm = document.getElementById('add-location-form');
if (createLocationForm) {
    createLocationForm.onsubmit = (event) => {
        event.preventDefault();
        const latitude = event.target['latitude-input'].value;
        const longitude = event.target['longitude-input'].value;
        writeLocationToFirestore(latitude, longitude);
    }
}

const myLocationComponent = document.getElementById('my-locations-component');
if (myLocationComponent) {
    readLocationsFromFirestore()
    .then( (locations) => {
        locations.forEach((location) => {
            addLocationToMyLocations(myLocationComponent, location);
        })
    })
}


window.deleteLocation = function(id) {
    deleteLocationFromFirestore(id)
        .then( () => window.location.reload() ); 
}

