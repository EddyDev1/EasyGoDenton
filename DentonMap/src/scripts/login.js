/**
 * Login js for handling login
 * 
 * March 22, 2024
 * 
 * Dahun Ju
 * Alexander Evans
 * 
 * Exports:
 *  function emailPasswordLoginHandler
 *  const googleSignin
 * 
 * Changelog:
 * Alexander Evans, March 22, 2024:
 * > Changed auth.user to result.user
 * 
 * Alexander Evans, March 13, 2024:
 * > Added googleSignin function for easy sign in through google
 * 
 * Alexander Evans
 * > Changed firebase imports to local scope
 * > Put the login functionality into a function called emailPasswordLoginHandler
 */

// imports firebase functions and objects
import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail 
} from "firebase/auth";
import { app } from "../firebase/firebaseConfiguration";


/**
 * Handles login through email and password
 * Add if statement to submitButton
 * March 13, 2024
 * Dahun Ju
 */
export const emailPasswordLoginHandler = () => {
  const auth = getAuth(app);
  const submitButton = document.getElementById("submit");
  const emailInput = document.getElementById("login_e-mail");
  const passwordInput = document.getElementById("login_password");
  var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

  if (submitButton) {
    submitButton.addEventListener("click", function (e) {
      email = emailInput.value;
      password = passwordInput.value;
      e.preventDefault();

      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even

          // Proceed to sign in after setting persistence
          signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in


            const user = userCredential.user;
            document.getElementById("login-fail").style.display = "none";
            //console.log("Success! Welcome back!");
            //window.alert("Success! Welcome back!");

            // Additional actions after successful login
            // For example, redirect to a different page
      
            // window.location.href = "/dashboard";

            // Or fetch additional user data, update UI, etc.
            // ...

            window.location.href = '../index.html';
          }).catch((signInError) => {
            // Handle other errors that may occur during signInWithEmailAndPassword
            const errorCode = signInError.code;
            const errorMessage = signInError.message;

            if (errorCode === "auth/invalid-email") {
              document.getElementById("login-fail-message").innerText = "Invalid email.";
              document.getElementById("login-fail").style.display = "block";
            } else if (errorCode === "auth/invalid-credential") {
              document.getElementById("login-fail-message").innerText = "Failed to login, make sure email and password are correct";
              document.getElementById("login-fail").style.display = "block";
            } else {
              document.getElementById("login-fail-message").innerText = "Error occurred. Try again.";
              document.getElementById("login-fail").style.display = "block";
              console.log("Error occurred. Try again.");
              console.log(`${errorCode}`);
            }
          })
        }).catch((setPersistenceError) => {
          // Handle errors from setPersistence
          console.error("Error setting persistence:", setPersistenceError);

          // You may want to provide feedback to the user or take appropriate action.
          document.getElementById("login-fail-message").innerText = "Error setting persistence. Try again.";
          document.getElementById("login-fail").style.display = "block";
        });
    });
  }
}

/**
 * Login for google
 * 
 * changed auth.user to result.user
 * March 22, 2024
 * Alexander Evans
 */
export const googleSignin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = 'it';

    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("successfully logged in ", result.user.displayName);
      alert(`Successfully logged in: ${result.user.displayName}`);
    })
    .catch((error) => {
      console.error("There was an error when signing in with Google: ", error);
    });
  }


/**
 * Anonymous signin so a user can interact with firebase backend without verified account
 * 
 * March 13, 2024
 * Alexander Evans
 */
export const anonymousSignin = () => {
  // Grabs the auth object from firebase
  const auth = getAuth();
  // Event listener from firebase which listens for a change in the user's status of logged in or not.
  onAuthStateChanged(auth, (user) => {
    // If the user is not logged in
    if (!user) {
      signInAnonymously(auth)
        .then(() => {
          console.log('User successfully signed in anonymously');
        })
        .catch((error) => {
          console.error('There was an error while signing in anonymously: ', error);
        });
    }
  });
}


export const resetPassword = () => {
  const auth = getAuth();
  const emailInput = document.getElementById("login_e-mail").value; 
  
  if(!emailInput) 
    return;

  sendPasswordResetEmail(auth, emailInput)
    .then(() => {
      alert("Password reset email sent, check the email to reset your password.");

      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    if(errorCode === "auth/missing-email"){
      alert("To reset password, must enter email address.");
      return;
    }  

    if(errorCode === "auth/invalid-email"){
      alert("Entered email address is invalid.");
      return;
    }

    alert(errorCode);

  
    });

}
