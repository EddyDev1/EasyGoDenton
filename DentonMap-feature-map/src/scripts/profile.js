import { database } from '../firebase/firebaseConfiguration.js';
import { getAuth } from "firebase/auth";

let clickElements = ["ChangePasswordBtn", "profile-firstname", "profile-lastname", "cancelPW",      "cancelChangeFirstName", "cancelChangeLastName"];
let displayElements = ["changePassword", "changeFirstName", "changeLastName"]

// Moved consts outside to prevent error within non profile pages


export const updateMargins = () => {
    // Added try - catch box to prevent errors within pages other than profile
    try {
        const profileBoxWidth = document.querySelector('.profile').offsetWidth;
        const profileItemWidth = document.querySelector('.profile-info-item').offsetWidth;
        const changePWBTNWidth = document.querySelector('#ChangePasswordBtn').offsetWidth;
        // Calculate the margin
        const marginValueInfos = (profileBoxWidth - profileItemWidth) / 2;

        document.querySelector('.grid-profile-info').style.margin = `10px ${marginValueInfos}px`;
        const marginValueBtn = (profileBoxWidth - changePWBTNWidth) / 2;

        document.querySelector('#ChangePasswordBtn').style.margin = `15px ${marginValueBtn}px $0px 10px`;
    }
    catch (error) {
        /* console.error("An error has occured within updateMargins: ", error); */
    }
}

// Checks if the query works and if profileBoxWidth does exist, then execute updateMargins

try 
{
    updateMargins();
}
catch (error) {
    //console.error("An error: ", error);
}

function centerForm(){
    const popUpWidth = document.querySelector('.form-popup').offsetWidth;
    const windowWith = document.querySelector('body').offsetWidth;
    const marginValueInfos = (windowWith - popUpWidth) / 2;
    document.querySelector('.form-popup').style.left = `${marginValueInfos}px`;
}
// Add event listener for window resize
window.addEventListener('resize', updateMargins);

try {
    document.getElementById("ChangePasswordBtn").addEventListener("click", () => {
        hideProfilePage();
        document.getElementById("changePassword").style.display = "block";
        centerForm();
        window.addEventListener('resize', centerForm);
    });

    document.getElementById("profile-firstname").addEventListener("click", () => {
        hideProfilePage();
        document.getElementById("changeFirstName").style.display = "block";
        centerForm();
        window.addEventListener('resize', centerForm);

    });

    document.getElementById("profile-lastname").addEventListener("click", () => {
        hideProfilePage();
        document.getElementById("changeLastName").style.display = "block";
        centerForm();
        window.addEventListener('resize', centerForm);

    });
    document.getElementById("cancelPW").addEventListener("click", () => {
        restoreProfilePage(),
            document.getElementById("changePassword").style.display = "none"
            window.removeEventListener('resize', centerForm);

    });
    document.getElementById("cancelChangeLastName").addEventListener("click", () => {
        restoreProfilePage(),
            document.getElementById("changeLastName").style.display = "none"
            window.removeEventListener('resize', centerForm);

    });
    document.getElementById("cancelChangeFirstName").addEventListener("click", () => {
        restoreProfilePage(),
            document.getElementById("changeFirstName").style.display = "none"
            window.removeEventListener('resize', centerForm);

    });
}
catch (error) {
    console.log("An error has occured in profile.js");
}
export const hideProfilePage = () => {
    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element, index, array) {
            element.style.display = "none";
        }
    );
    
    document.getElementById(displayElements[clickElements.indexOf(id) % 3]).style.display = "block";
}


// window.closeForm = closeForm; this allow onclick="closeForm()"

export const restoreProfilePage = (id) => {
    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element, index, array) {
            element.style.display = "block";
        }
    );
    updateMargins();
}


export const  getFirstName = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    if (user !== null) {
        user.providerData.forEach((profile) => {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
        });
    } else {
        console.log("not logged in");
    }
}

function getlastName() {

}

function setFirstName() {

}

function setlastName() {

}


function getLocationList() {

}

function updatePassword() {

}