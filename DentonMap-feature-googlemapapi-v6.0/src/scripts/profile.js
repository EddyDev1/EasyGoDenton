import { database } from '../firebase/firebaseConfiguration.js';
import { getAuth } from "firebase/auth";



function updateMargins() {
    const profileBoxWidth = document.querySelector('.profile').offsetWidth;
    const profileItemWidth = document.querySelector('.profile-info-item').offsetWidth;
    const changePWBTNWidth = document.querySelector('#ChangePasswordBtn').offsetWidth;

    // Calculate the margin
    const marginValueInfos = (profileBoxWidth - profileItemWidth) / 2;

    document.querySelector('.grid-profile-info').style.margin = `10px ${marginValueInfos}px`;
    const marginValueBtn = (profileBoxWidth - changePWBTNWidth) / 2;

    document.querySelector('#ChangePasswordBtn').style.margin = `15px ${marginValueBtn}px $0px 10px`;
}

updateMargins();


// Add event listener for window resize
window.addEventListener('resize', updateMargins);


document.getElementById("ChangePasswordBtn").addEventListener("click", () => {
    hideProfilePage();
    document.getElementById("changePassword").style.display = "block";
});

document.getElementById("profile-firstname").addEventListener("click", () => {
    hideProfilePage();
    document.getElementById("changeFirstName").style.display = "block";
});

document.getElementById("profile-lastname").addEventListener("click", () => {
    hideProfilePage();
    document.getElementById("changeLastName").style.display = "block";
});



document.getElementById("cancelPW").addEventListener("click", () => {
    restoreProfilePage(),
        document.getElementById("changePassword").style.display = "none"
});
document.getElementById("cancelChangeLastName").addEventListener("click", () => {
    restoreProfilePage(),
        document.getElementById("changeLastName").style.display = "none"
});
document.getElementById("cancelChangeFirstName").addEventListener("click", () => {
    restoreProfilePage(),
        document.getElementById("changeFirstName").style.display = "none"
});

function hideProfilePage() {
    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element, index, array) {
            element.style.display = "none";
        }
    );
}

// window.closeForm = closeForm; this allow onclick="closeForm()"

function restoreProfilePage() {
    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element, index, array) {
            element.style.display = "block";
        }
    );
}

getFirstName();

function getFirstName() {
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