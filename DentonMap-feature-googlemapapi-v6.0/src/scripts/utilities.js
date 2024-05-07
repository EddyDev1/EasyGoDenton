/**
 * Utilities contains exported functions which adds functionality to app.js
 * 
 * exports:
 * > assignClick
 * > initializeSigninButtons
 */

import { getAuth, onAuthStateChanged} from "firebase/auth";

export const assignClick = (elementId, func) => {
    const clickElement = document.getElementById(elementId);
    if (clickElement) clickElement.onclick = func;
}

/**
 * Checks if the user is signed in before showing or hiding certain buttons
 */
export const initializeSigninButtons = () => {
    const myprofile = document.getElementById('appbar-myprofile-link');
    const signOut = document.getElementById('appbar-signout-button');
    const signin = document.getElementById('appbar-signin-button');
    const register = document.getElementById('appbar-register-button');
    const addlocation = document.getElementById('appbar-addlocation-link');
    const mylocation =  document.getElementById('appbar-mylocation-link');

    if (signin && signOut && myprofile && register) {
        const auth = getAuth();
        // This is an observable method
        // Which means it will be triggered everytime the auth state changes
        auth.onAuthStateChanged( (user) => {
            // When the user is signed in
            if (user && !user.isAnonymous) {
                    signin.style.display = 'none';
                    register.style.display = 'none';

                    addlocation.style.display = 'inline-block';
                    mylocation.style.display = 'inline-block';    
                    signOut.style.display = 'inline-block';
                    myprofile.style.display = 'inline-block';

            } 
            // When the user is signed out
            else {
                signin.style.display = 'inline-block';
                register.style.display = 'inline-block';
                
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
 * @param {*} location
 */
export const addLocationToMyLocations = (myLocationsComponent, location) => {
    const locationContainer = document.createElement('div');
    locationContainer.setAttribute('class', 'location-container');

    locationContainer.innerHTML = `
        <h3>${location.latitude} and ${location.latitude}</h3>
        <div>
            <!--<a href="/editlocation.html?id=${location.id}"><button>Edit</button></a>-->
            <button onclick="window.deleteLocation('${location.id}')">Delete</button>
        </div>
    `;

    myLocationsComponent.append(locationContainer);
}

