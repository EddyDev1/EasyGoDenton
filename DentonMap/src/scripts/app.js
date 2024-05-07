/**
 * Desc: Main javascript file for node.js and front-end
 * 
 * April 29, 2024
 * Added google login to login manip
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
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { addLocationToMyLocations, assignClick, initializeSigninButtons, highlightPage } from "./utilities.js";
// Dahun Ju's window signup function from register
import { registerWindowSignup  } from "./register.js";
// Ju's handler for email-password login
import { emailPasswordLoginHandler, googleSignin, anonymousSignin, checkSignIn, resetPassword } from "./login.js";
// Ju's profile functions
import { updateMargins, restoreProfilePage, hideProfilePage, updateId, updateProfilePage, changePassword } from "./profile.js";
// signs users out
import { signOut } from "../firebase/firebaseSignout.js";
// adds lat, long, uid doc to firestore
import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore, batchWrite } from "../firebase/firebaseRepository.js"
// google maps api, pinSubmit() submits the pins to firestore
import { loadMap, pinSubmit, initializeLocationsMap, filterMap } from "./maps.js";
import { addLocationInterface } from "../firebase/firebaseAddLocationInterface.js";
import PinLocation from "../firebase/firebaseLocationClass.js";
import auth from "../firebase/firebaseAuthenticationClass.js";
import { createLocationsFirestore } from "../firebase/firebaseReadLocations.js";
import { createDiv, deleteDiv, getDescription } from "./mapsUtils.js";
import { automaticLogIn } from "./devUtilities.js";
import { doc } from "firebase/firestore/lite";
<<<<<<< HEAD
=======

>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f

// Global scope array containing all the locations from the locations database
var locations = [PinLocation];
var form = document.body.getElementsByClassName("login-form");
var buttons = document.getElementsByClassName("download-index");

/**
 * Constructs the array then passes it to main()
 */
async function locationsConstructor () {
    // Automatically logs in
    /* automaticLogIn(); */
    locations = await createLocationsFirestore();
    initializeLocationsMap(locations);
}

/**
 * Main thread of execution
 * locations[] will be accessible in main, feel free to pass this array containing ALL the locations into any method/functions calls.
 */
const main = () => {
    // Grab the appbar
    const appbar = document.getElementsByClassName("header-app");


    // For hiding and showing buttons that rely
    // on being signed in or out
    //anonymousSignin();
    initializeSigninButtons();

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
    assignClick('signin-google', googleSignin);


    // dom manip function
    function change(element, type){
        if (type === "show")
        {
            for (let ele of element)
                ele.style.display = "block";
        }
        else if (type === "hide")
        {
            for (let ele of element)
                ele.style.display = "none";
        }
        else if (type === "inline")
        {
            for (let ele of element)
                ele.style.display = "inline-block";
        }
    }

    /**
     * Added <p> tags to remove() - alex
     * @param {*} forms 
     */
    function remove(forms)
    {
        for (let form of forms)
        {
            change(form.querySelectorAll("a"), "hide");
            change(form.querySelectorAll("input"), "hide");
            change(form.querySelectorAll("button"), "hide");
            change(form.querySelectorAll("p"), "hide");
            change(form.querySelectorAll("label"), "hide");
        }

        /** iterates over each <a> in appbar and sets the color to zero (dehighlights current page) */
        for (let i = 0; i < appbar.length; i++) {
            let element = appbar[i];
            element.style['color'] = "";
        }

        document.getElementById("floating-panel").style.display = "none";
        document.querySelector(".grid-main").style.display = "none";
        document.querySelector(".grid-container.profile").style.display = "none";

        const divs = document.getElementById("temp-location");

        if (divs)
            divs.style.display = "none";
    }

    // for travel page label
    remove(form);

    // profile.html
    const profile = document.getElementById("appbar-myprofile-link");
    if (profile) {
        profile.addEventListener('click', () => {
    
            const regexProfile = new RegExp("\\b[pC]");
            const regexChangeCancel = new RegExp("\\b[cn]");

            remove(form);
            highlightPage(profile);
            change(buttons, "hide");
            updateProfilePage();

            document.getElementById("set-header").innerText = "User Profile Settings";
            document.querySelector(".grid-main").style.display = "block";
            document.querySelector(".grid-container.profile").style.display = "block";

            document.querySelector("aside").addEventListener('click', (event) => {
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
                else {
                    if (event.target.id.includes("NameUpdateBTN"))
<<<<<<< HEAD
                        update(event.target.id);
=======
                        updateId(event.target.id);
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
                    else if (event.target.id === "sign-out")
                        signOut();
                }
            });
        });
    }

    // for pages that have multiple ways to access another page
    let navlink, hyperlink;

    // manip index.html register code when register in nav-bar is clicked
    function register(id)
    {
        const appbarRegister = document.getElementById(id);
        appbarRegister.addEventListener('click', () => {
            document.getElementById("set-header").innerText = "Register New Account";
            remove(form);
            highlightPage(appbarRegister);
            const inputs = form[1].querySelectorAll("input");
            const reg_buttons = form[1].querySelectorAll("button");
            const a_tag = form[0].querySelectorAll("a");
    
            change(inputs, "show");
            change(reg_buttons, "show");
            change(a_tag, "show");
            change(buttons, "hide");
        });
    }

    navlink = document.getElementById("appbar-register-button1");
    hyperlink = document.getElementById("appbar-register-button2");

    if (navlink) {
        navlink.addEventListener("click", register("appbar-register-button1"));

        if (hyperlink)
            hyperlink.addEventListener("click", register("appbar-register-button2"));
    }
    
    // manip index.html login code when sign in in nav-bar is clicked
    // Added google login
    function login(id)
    {
        const loginHTML = document.getElementById(id);
        loginHTML.addEventListener('click', () => {
            document.getElementById("set-header").innerText = "Login to Profile";
            remove(form);
            highlightPage(loginHTML);

            const inputs = form[3].querySelectorAll("input");
            const reg_buttons = form[3].querySelectorAll("button");
            const a_tag = form[3].querySelectorAll("a");
   
            change(inputs, "show");
            change(reg_buttons, "show");
            change(a_tag, "show");
            change(buttons, "hide");
        });
    }

    navlink = document.getElementById("appbar-signin-button1");
    hyperlink = document.getElementById("appbar-signin-button2");

    if (navlink) {
        navlink.addEventListener("click", login("appbar-signin-button1"));
        
        if (hyperlink)
            hyperlink.addEventListener("click", login("appbar-signin-button2"));
    }
<<<<<<< HEAD
    // Set the #help button to activate help(0)
    const helplink = document.getElementById("appbar-more-information");
=======
  
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
    // Help function appbar-more-information
    const help = (id) => {
        document.getElementById("set-header").innerText = "Help Page";
        const moreInformation = document.getElementById("help-form");
        const helpClass = document.getElementsByClassName("help-class");
        const helpA = document.getElementById("help-a");

        // Remove the current form
        remove(form);
<<<<<<< HEAD
        highlightPage(helplink);
        /* console.log("click"); */
        console.log(moreInformation);
=======
        change(buttons, "hide");

>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
        moreInformation.style.display = "inline-block";
        change(helpClass, "show");
        helpA.style.display = "flex";

    }
<<<<<<< HEAD
=======
    
    // Set the #help button to activate help(0)
    const helplink = document.getElementById("appbar-more-information");
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
    if (helplink) {
        helplink.addEventListener("click", help);
    }

    // manip index.html map code when map in nav-bar is clicked
    const appbarMapLink = document.getElementById("appbar-map-link");
    // Initial Run
    highlightPage(appbarMapLink);
    appbarMapLink.addEventListener('click', () => {
        document.getElementById("set-header").innerText = "Display Settings";
        remove(form);
        highlightPage(appbarMapLink);
        change(buttons, "show");
        buttons[2].style.display = "none";
        buttons[3].style.display = "none";
<<<<<<< HEAD
=======
        buttons[4].style.display = "none";
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
    });

    const travel_page = document.getElementById("appbar-addlocation-link");
    if (travel_page)
    {
        travel_page.addEventListener('click', () => {
            document.getElementById("set-header").innerText = "Travel";
            remove(form);
            highlightPage(travel_page);
            change(buttons, "hide");

            const inputs = form[5].querySelectorAll("input");
            const reg_buttons = form[5].querySelectorAll("button");
            const a_tag = form[5].querySelectorAll("a");
            const label = form[5].querySelectorAll("label");
            console.log(label);
            change(inputs, "show");
            change(reg_buttons, "show");
            change(a_tag, "show");
            change(label, "inline");  
            document.getElementById("floating-panel").style.display = "inline";
        });
    }

    /** Access Page */
    const access_page = document.getElementById("appbar-mylocation-link");
    if(access_page)
    {
        access_page.addEventListener('click', () => {
            document.getElementById("set-header").innerText = "Access Spots";
            remove(form);
            highlightPage(access_page);
            change(buttons, "hide");

            buttons[2].style.display = "block";
            buttons[3].style.display = "block";
<<<<<<< HEAD
=======
            buttons[4].style.display = "block";
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f

            const divs = document.getElementById("temp-location");
            if (divs)
                divs.style.display = "block";
            
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

    /** Delete Div */
    // Delete Button HTML Element
    const deleteMessage = "<h3 color='red' size='22px'>This div is deleted</h3>";
    const delete_button = document.getElementById('delete-markers');
    // Array of the HTMLElements of each location to delete
    let deleteLocationsHTML = [{Number, HTMLElement}];
    var index = 0;
    // Bool value to indicate if the button is on or off
    let isDeleteOn = false;
    const myLocationComponent = document.getElementById('my-locations-component');
    const delete_Constructor = () => {
        if (isDeleteOn) {
            myLocationComponent.innerHTML = "";
            isDeleteOn = false;
            delete_button.innerHTML = "Delete Markers: Off";
            return;
        }

<<<<<<< HEAD
        delete_button.innerHTML = "Delete Markers: On";
=======
        delete_button.innerHTML = "Delete Markers: <b>On</b>";
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
        isDeleteOn = true;
        locations.forEach( (location) => {
            onAuthStateChanged(auth.myauth, () => {
                if (!location) {
                    const locationContainer = document.createElement('div');
                    locationContainer.innerHTML = deleteMessage;
                    myLocationComponent.append(locationContainer);
                }
                else {
                    addLocationToMyLocations(myLocationComponent, location, index);
                }
                index++;
            })
        })
    }

    if (delete_button) {
        delete_button.addEventListener('click', delete_Constructor);
    }

    // Deletes location from window
    // Has a window.reload()
    window.deleteLocation = function(id, index) {
        console.log(id);
        deleteLocationFromFirestore(id, locations, index)
        .then( () => {
            const delete_Id = document.getElementById(`#${index}`);
            delete_Id.innerHTML = deleteMessage;
        })
        .catch ( (error) => {
            console.error("An error has occured with deletion", error);
        });

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

    const marker_function = document.getElementById('add-markers');
    if (marker_function)
    {
        marker_function.addEventListener('click', () => {
            const len = marker_function.innerText.length;

            if (len ===  14)
                marker_function.innerText = "Add Marker: Off";
            else
                marker_function.innerHTML = "Add Marker: <b>On</b>";
        });
    }

    const filter_function = document.getElementById('filter');
    if (filter_function)
    {
        filter_function.addEventListener('click', () => {
            const len = filter_function.innerText.length;

            if (len ===  11)
                filter_function.innerText = "Filter: Parking", filterMap("R"), filterMap("P");
            else if (len === 15 )
                filter_function.innerText = "Filter: Button", filterMap("R"), filterMap("B");
            else
                filter_function.innerText = "Filter: Off", filterMap("R");
        });
    }



    // Debugging writeToFirestore
    async function location_Debugger() {
        const myLat = 33.211210;
        const myLong = -97.151875;

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
}


const reset = document.getElementById('resetPW-button'); 
if (reset) 
    reset.addEventListener('click', () => {resetPassword()});




// Function calls
anonymousSignin();
locationsConstructor().then( () => {
    main();
})
.catch( (error) =>{
    console.error("an error has occured with main():", error);
    main();
})
