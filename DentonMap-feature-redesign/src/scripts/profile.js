import { database } from '../firebase/firebaseConfiguration.js';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { emailToBase64 } from './utilities';
import { get, ref, update, child } from 'firebase/database';
import { signOut } from '../firebase/firebaseSignout';

let clickElements = ["ChangePasswordBtn", "profile-firstname", "profile-lastname", "cancelPW",      "cancelChangeFirstName", "cancelChangeLastName", "changePWBTN", "firstNameUpdateBTN", "lastNameUpdateBTN"];
let displayElements = ["changePassword", "changeFirstName", "changeLastName"]

export const updateMargins = () => {
    const profileBoxWidth = document.querySelector('.profile').offsetWidth;
    const profileItemWidth = document.querySelector('.profile-info-item').offsetWidth;
    const changePWBTNWidth = document.querySelector('#ChangePasswordBtn').offsetWidth;

    // Calculate the margin
    const marginValueInfos = (profileBoxWidth - profileItemWidth) / 2;

    document.querySelector('.grid-profile-info').style.margin = `10px ${marginValueInfos}px`;
    const marginValueBtn = (profileBoxWidth - changePWBTNWidth) / 2;

    document.querySelector('#ChangePasswordBtn').style.margin = `15px ${marginValueBtn}px $0px 10px`;
}

export const hideProfilePage = (id) => {
    if (id.includes("place"))
        return;

    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element) {
            element.style.display = "none";
        }
    );

    document.getElementById(displayElements[clickElements.indexOf(id) % 3]).style.display = "block";
    centerForm();
    window.addEventListener('reize', centerForm);
}


export const restoreProfilePage = (id) => {
    if (id  == 'currPWInput' || id == 'newPWInput')
        return;

    Array.from(document.getElementsByClassName("profile")).forEach(
        function (element) {
            element.style.display = "block";
        }
    );

    document.getElementById(displayElements[clickElements.indexOf(id) % 3]).style.display = "none";
    centerForm();
    window.removeEventListener('reize', centerForm);
}

export async function changePassword()
{
    const currPW = document.getElementById("currPWInput").value;
    const newPW = document.getElementById("newPWInput").value;

    if(!(currPW && newPW)){
        document.getElementById("errorMSGPW").innerText = "Current value and new password must have value.";
        return;
    }

    if(currPW.length < 6 || newPW.length < 6){
        document.getElementById("errorMSGPW").innerText = "Current value and new password have at least 6 characters.";
        return;
    }

    document.getElementById("errorMSGPW").innerText = "";

    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currPW);

    reauthenticateWithCredential(user, credential)
        .then(() => {
            console.log("User reauthenticated successfully.");

            // Now you can proceed with updating the password
            updatePassword(user, newPW)
                .then(() => {
                    alert("Password updated successfully.");
                })
                .catch((error) => {
                    console.error("Error reauthenticating:", error);
                    if (error.code === "auth/invalid-credential") {
                        console.log("Password mismatch: The provided current password is incorrect.");
                        document.getElementById("errorMSGPW").innerText = "The provided current password is incorrect.";
                    }

                    // Handle error updating password
                });
        })
        .catch((error) => {
            console.error("Error checking password:", error);
            // Handle error reauthenticating user
        });

    alert("please log back in.");
    signOut();
    window.location.href = "../user-profile.html";
}

export async function update(id)
{
    const email = await getCurrentEmail();
    const firstOrLast = id[0] === 'f';
    const name = document.getElementById(firstOrLast ? "firstNameInput" : "lastNameInput").value;

    if (email && name)
    {
        if (firstOrLast)
        {
            updateFirstName(email, name);
            document.getElementById("firstNameErrorMSG").innerText = "";
        }
        else
        {
            updateLastName(email, name);
            document.getElementById("lastNameErrorMSG").innerText = "";
        }

        updateProfilePage(id);
        restoreProfilePage(id);
    }
    else
    {
        if (firstOrLast)
        {
            if(!email){
                document.getElementById("firstNameErrorMSG").innerText = "Cannot get email information, did you sign in?";
                return;
            }

            if(!first){
                document.getElementById("firstNameErrorMSG").innerText = "First name cannot be empty.";
                return;
            }
        }
        else
        {
            if(!email){
                document.getElementById("lastNameErrorMSG").innerText = "Cannot get email information, did you sign in?";
                return;
            }

            if(!last){
                document.getElementById("lastNameErrorMSG").innerText = "Last name cannot be empty.";
                return;
            }
        }
    }
}

async function updateFirstName(email, name) {
    let emailKey = emailToBase64(email);
    await update(ref(database, 'users/' + emailKey), {
        firstname: name,
        email: email,
    });

}

async function updateLastName(email, name) {
    let emailKey = emailToBase64(email);
    await update(ref(database, 'users/' + emailKey), {
        lastname: name,
        email: email,
    });
}

async function getUserData(email) {
    if (!email) {
        return null;
    }

    const emailKey = emailToBase64(email);
    const dbRef = ref(database);

    try {
        const snapshot = await get(child(dbRef, `users/${emailKey}`));
        let userData;
        if (snapshot.exists()) {
            userData = snapshot.val();
            return userData;
        } else {
            console.log("No data available");
        }
        return userData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCurrentEmail() {
    const auth = getAuth();
    let user = auth.currentUser;

    if (!user)
    {
        await new Promise((resolve, reject) => {
            auth.onAuthStateChanged(u => {
                user = u;
                resolve();
            });
        });
    }

    return user ? user.email : '';
}


export async function updateProfilePage() {
    const email = await getCurrentEmail();
    const info = await getUserData(email)

    document.getElementById("firstNameValue").innerText = info ? info.firstname : "";
    document.getElementById("lastNameValue").innerText = info ? info.lastname : "";
}

function centerForm() {
    const popUpWidth = document.querySelector('.form-popup').offsetWidth;
    const windowWith = document.querySelector('body').offsetWidth;
    const marginValueInfos = (windowWith - popUpWidth) / 2;
    document.querySelector('.form-popup').style.left = `${marginValueInfos}px`;
}