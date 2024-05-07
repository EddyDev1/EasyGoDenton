/**
 * Utilities contains exported functions which adds functionality to app.js
 * 
 * exports:
 * > assignClick
 * > initializeSigninButtons
 */

import { getAuth, onAuthStateChanged} from "firebase/auth";
// auth object from auth singleton
import auth from "../firebase/firebaseAuthenticationClass"; 
import PinLocation from "../firebase/firebaseLocationClass";

export const assignClick = (elementId, func) => {
    const clickElement = document.getElementById(elementId);
    if (clickElement) clickElement.onclick = func;
}

/**
 * Checks if the user is signed in before showing or hiding certain buttons
 */

export const ensureSignedIn = (redirect) => {
    onAuthStateChanged(auth.myauth, (user) => {
        if( user && !user.isAnonymous ){
            console.log("The user logged In");
            user.providerData.forEach((profile) => {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
        }else{
            alert("To use this page, you need to sign in. Redirect to login page.");
            window.location.href = redirect;
        }

    });
}

export function emailToBase64(email) //convert to lowercase then convert to base64
{
    let lowered = email.toLowerCase();
    
    // Convert the UTF-8 encoded string to Base64
    const base64EncodedEmail = btoa(encodeURIComponent(lowered));

    return base64EncodedEmail;
}


export const initializeSigninButtons = () => {
    const myprofile = document.getElementById('appbar-myprofile-link');
    const signOut = document.getElementById('appbar-signout-button');
    const signin = document.getElementById('appbar-signin-button1');
    const register = document.getElementById('appbar-register-button1');
    const addlocation = document.getElementById('appbar-addlocation-link');
    const mylocation =  document.getElementById('appbar-mylocation-link');
    const help = document.getElementById('appbar-more-information');

    if (signin && signOut && myprofile && register) {
        
        // This is an observable method
        // Which means it will be triggered everytime the auth state changes
        onAuthStateChanged(auth.myauth, (user) => {
            // When the user is signed in
            if (user && !user.isAnonymous) {
                    signin.style.display = 'none';
                    register.style.display = 'none';

                    addlocation.style.display = 'inline-block';
                    mylocation.style.display = 'inline-block';    
                    signOut.style.display = 'inline-block';
                    myprofile.style.display = 'inline-block';
                    help.style.display = 'inline-block';

            } 
            // When the user is signed out
            else {
                signin.style.display = 'inline-block';
                register.style.display = 'inline-block';
                help.style.display = 'inline-block';
                
                mylocation.style.display = 'none';   
                addlocation.style.display = 'none';

                signOut.style.display = 'none';
                myprofile.style.display = 'none';
            }
        });
    }
}

/**
 * Dynamically uses DOM to add the user's locations
 * @param {*} myLocationsComponent 
 * @param {PinLocation} location
 * @param {Number} index index in the locations array
 */
export const addLocationToMyLocations = (myLocationsComponent, location, index) => {
    const locationContainer = document.createElement('div');
    locationContainer.setAttribute('class', 'location-container');
    locationContainer.setAttribute('id', `#${index}`)
    /* console.log("Add location index: ", index); */
    /* console.log(location); */
    locationContainer.innerHTML = `
        <h3>${location.desc}</h3>
        <h4>Latitude: ${location.latitude}</h4>
        <h4>Longitude: ${location.longitude}</h4>
<<<<<<< HEAD
        <div>
=======
        <div class="delete-button-div">
>>>>>>> 65b59a18a22ca7d685e6810aeec9b3f40cd66c1f
            <!--<a href="/editlocation.html?id=${location.locationid}"><button>Edit</button></a>-->
            <button onclick="window.deleteLocation('${location.locationid}', '${index}')">Delete</button>
        </div>
    `;

    myLocationsComponent.append(locationContainer);
}

/**
 * Highlights the current page in the appbar
 * @param {HTMLElement} currentPage the current page the user is on
 */
export const highlightPage = (currentPage) => {
    if (!currentPage) throw new Error("Passed page is null");

    console.log(currentPage);
    currentPage.style.setProperty('color',"#B0DBF1")
}
