/**
 * Desc: Main javascript file for node.js and front-end
 * 
 * April 14, 2024
 * 
 * Alexander Evans
 * 
 * Changelog:
 * Alexander Evans
 * Refractored the app.js page into two parts, locationConstructor() and main()
 * main() is the main thread of execution, your code would go here
 * 
 * Alexander Evans
 * > Created file
 * > Added assignClick from utilities js
 * > Added registerWindowSignup from register.js which is a refractoring
 * > of Ju's windows.signup function
 */

import {app} from "../firebase/firebaseConfiguration.js";
import { onAuthStateChanged } from "firebase/auth";

import { addLocationToMyLocations, assignClick, initializeSigninButtons } from "./utilities.js";
// Dahun Ju's window signup function from register
import { registerWindowSignup  } from "./register.js";
// Ju's handler for email-password login
import { emailPasswordLoginHandler, googleSignin, anonymousSignin, checkSignIn } from "./login.js";
// Ju's profile functions
import { updateMargins, restoreProfilePage, hideProfilePage, getFirstName } from "./profile.js";

// signs users out
import { signOut } from "../firebase/firebaseSignout.js";
// adds lat, long, uid doc to firestore
import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore, batchWrite } from "../firebase/firebaseRepository.js"
// google maps api, pinSubmit() submits the pins to firestore
import { loadMap, pinSubmit, initializeLocationsMap } from "./maps.js";
import { addLocationInterface } from "../firebase/firebaseAddLocationInterface.js";
import PinLocation from "../firebase/firebaseLocationClass.js";
import auth from "../firebase/firebaseAuthenticationClass.js";
import { createLocationsFirestore } from "../firebase/firebaseReadLocations.js";
import { createDiv, deleteDiv, getDescription } from "./mapsUtils.js";

// Global scope array containing all the locations from the locations database
var locations = null;

/**
 * Constructs the array then passes it to main()
 */
async function locationsConstructor () {
    locations = await createLocationsFirestore();
    initializeLocationsMap(locations);
}
/**
 * Main thread of execution
 * locations[] will be accessible in main, feel free to pass this array containing ALL the locations into any method/functions calls.
 */
const main = () => {
    // For hiding and showing buttons that rely
    // on being signed in or out
    initializeSigninButtons();
    anonymousSignin();

    // Map Call
    loadMap();
    // Handler for submitting created pins on the map
    pinSubmit();

    // Sets the signout button to activate if someone clicks it.
    assignClick('appbar-signout-button', signOut);

    // Adds listener for windows signup
    registerWindowSignup();

    // Handler for email-password logins
    emailPasswordLoginHandler();
    // Google Sign in
    assignClick ('signin-google', googleSignin);

    // profile.html
    const regexProfile = new RegExp("\\b[pC]");
    const regexChangeCancel = new RegExp("\\b[c]");


    try {
        document.body.addEventListener('click', (event) => {
            if (regexProfile.test(event.target.id))
            {
                hideProfilePage(event.target.id);
            }
            else if (regexChangeCancel.test(event.target.id))
            {
                restoreProfilePage(event.target.id);
            }
            
            // Add event listener for window resize
            window.addEventListener('resize', updateMargins);
    });
    } catch (error) {
        //do nothing
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
    console.log("My Location Component: ", myLocationComponent);
    if (myLocationComponent) {
        console.log("Hello World\n");
        readLocationsFromFirestore()
        .then( (locations) => {
            locations.forEach((location) => {
                addLocationToMyLocations(myLocationComponent, location);
            })
        })
    }

    // Author: Edward Asante
    // April 13: Alexander Evans
    // Refractored to check for the download_Button before adding an event listener
    const download_Button = document.getElementById('download');
    if (download_Button) {
        download_Button.addEventListener('click', () => {
            let content = 'desc,lat,long\n';
            
            for (let location of locations)
            {
                content += location.desc + ',' + location.latitude.toString();
                content += ',' + location.longitude.toString() + '\n';
            } 

            const blob = new Blob([content], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'locations.csv';
            link.click();

            URL.revokeObjectURL(url);
        });
    }

    // Deletes location from window
    // Has a window.reload()
    window.deleteLocation = function(id) {
        deleteLocationFromFirestore(id)
            .then( () => window.location.reload() ); 
    }

    // Debugging writeToFirestore
    async function location_Debugger() {
        const myLat = 33.211210;
        const myLong = -97.151875;

        const desc = "Hello World";

/*         let myLocation = new PinLocation(myLat, myLong);
        myLocation.set_username("TheDogMan");
        myLocation.set_description("ChestnutStreet");

        locations.push(myLocation); */
/*         console.log(locations);
        batchWrite(locations); */
        // Add a new location

        // Debugging the dynamic description box
/*         createDiv();
        createDiv();
        deleteDiv(1); */
/*         const myDesc = getDescription(2);
        console.log(myDesc); */
}

// Function calls
locationsConstructor().then( () => {
    main();
})
.catch( (error) =>{
    console.error("an error has occured with main():", error);
    main();
})