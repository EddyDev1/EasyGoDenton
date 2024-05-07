/**
 * Register handlers and main for register.html
 * Imports from firebase/app
 * No exports
 * March 12, 2024
 * 
 * Dahun Ju
 * Alexander Evans
 * 
 * Exports:
 *  registerWindowSignup : handler for people signing up
 * 
 * Changelog: 
 * Alexander Evans
 * >Changed import to local firebase project instead of Google's API
 * >Removed firebase app instantiation and place it into firebaseConfiguration
 * 
 * >cleaned up auth to getAuth()
 * >refractored window.signup handler into registerWindowSignup lambda function to allow for modularity.
 */

// imports firebase functions and objects
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// Firebase app
import { app } from "../firebase/firebaseConfiguration.js";



/** 
 * for register.html, registers through email
 * register with a window.signup handler
 * 
 * March 13, 2024
 * Dahun Ju
 * */ 
export const registerWindowSignup = () => {
    // Getting All the Objects of htmls
    var firstname = document.getElementById("first-name");
    var lastname = document.getElementById("last-name");
    var email = document.getElementById("e-mail");
    var password = document.getElementById("password");
    var passwordConfirm = document.getElementById("password-reconfirm");

    // get auth
    var auth = getAuth(app);
    window.signup = function (e) {
    e.preventDefault();

    if (password.value.length < 6) {
        document.getElementById("register-fail-message").innerText = "Password should be at least 6 characters.";
        document.getElementById("register-fail").style.display = "block";
        // alert("Password mismatch");
        return;
    }

    if (password.value !== passwordConfirm.value) {
        document.getElementById("register-fail-message").innerText = "Password and confirmed password should be same.";
        document.getElementById("register-fail").style.display = "block";
        // alert("Password mismatch");
        return;
    }

    document.getElementById("register-fail").style.display = "none";

    var obj = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value,
    }
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then(function (sucess) {
            alert("Signup Successfully")
        }).catch(function (err) {
            if (err.code === "auth/email-already-in-use") {
                document.getElementById("register-fail-message").innerText = "Email already exists. Please use a different email address.";
                document.getElementById("register-fail").style.display = "block";
            } else {
                alert("Error: " + err.message);
            }
        })
    console.log(obj)
    }
}