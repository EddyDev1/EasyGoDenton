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
import { emailPasswordLoginHandler, googleSignin, anonymousSignin, checkSignIn } from "./login.js";
// Ju's profile functions
import { updateMargins, restoreProfilePage, hideProfilePage, update, updateProfilePage, changePassword } from "./profile.js";

// signs users out
import { signOut } from "../firebase/firebaseSignout.js";
// adds lat, long, uid doc to firestore
import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore} from "../firebase/firebaseRepository.js"
import { addLocationInterface } from "../firebase/firebaseAddLocationInterface.js";

// For hiding and showing buttons that rely
// on being signed in or out
initializeSigninButtons();
anonymousSignin();

// Sets the signout button to activate if someone clicks it.
assignClick('appbar-signout-button', signOut);

// Adds listener for windows signup
registerWindowSignup();

// Handler for email-password logins
emailPasswordLoginHandler();
// Google Sign in
assignClick ('signin-google', googleSignin);

// profile.html

if (window.location.href.substring(22) === 'user-profile.html') {
    const regexProfile = new RegExp("\\b[pC]");
    const regexChangeCancel = new RegExp("\\b[cn]");

    updateProfilePage();

    document.body.addEventListener('click', (event) => {
        if (regexProfile.test(event.target.id))
        {
            hideProfilePage(event.target.id);
        }
        else if (regexChangeCancel.test(event.target.id))
        {
            if (event.target.id === 'changePWBTN')
                changePassword();
                
            restoreProfilePage(event.target.id);
            
            // Add event listener for window resize
            window.addEventListener('resize', updateMargins);
        }
        else
        {
            if (event.target.id.includes("NameUpdateBTN"))
                update(event.target.id);
        }
    });
}

// Add location
// Has a window.location.reload
const createLocationForm = document.getElementById('add-location-form');
if (createLocationForm) {
    const emptyPlaceholder = "";
    createLocationForm.onsubmit = (event) => {
        
        // prevents the default action (form submittion)
        event.preventDefault();
        // latitude
        const latitude = event.target['latitude-input'].value;
        // longitude
        const longitude = event.target['longitude-input'].value;
        // Writes the location and userid to database
        addLocationInterface(latitude, longitude)
        .then( () => {
            document.getElementById('latitude-input').value = emptyPlaceholder;
            document.getElementById('longitude-input').value = emptyPlaceholder;
        })
        .catch ( (error) =>{
            console.error("An error has occured with addLocation: ", error);
        });
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

// Deletes location from window
// Has a window.reload()
window.deleteLocation = function(id) {
    deleteLocationFromFirestore(id)
        .then( () => window.location.reload() ); 
}