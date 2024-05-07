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
import { getDatabase  } from "firebase/database";



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
        /*passhttps:github.com/wajdialjedaani/DentonMap/pull/70/conflict?name=src%252Fscripts%252Fregister.js&ancestor_oid=d79129ff3013584b8fd07267af64c3ac54332ec1&base_oid=caf2be9ff73d79db844a55b7688593478479a937&head_oid=4bb6d7cb0c4f230fe201b09f6cae992512a729a5word:*/ 
        password: password.value,
    };

    backendTest();

    async function backendTest()
    {
        try 
        {
            const email = obj.email;
            const password = obj.password;
            const fname = obj.firstname;
            const lname = obj.lastname;
            
            const response = await fetch('http://localhost:3000/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password, fname, lname})
          });

          if (response.ok) {
            alert("Email verification sent. Redirecting...");
            window.location.href = "map.html";
          } else {
              throw new Error('Register failed');
          }
      } 
      catch (error) 
      {
          console.error('Register error: ', error);
      }

    }
    }
}