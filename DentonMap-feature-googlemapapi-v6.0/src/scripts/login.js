/**
 * Login js for handling login
 * 
 * March 13, 2024
 * 
 * Dahun Ju
 * Alexander Evans
 * 
 * Exports:
 *  function emailPasswordLoginHandler
 *  const googleSignin
 * 
 * Changelog:
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
  signInAnonymously
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
  const submitButton = document.getElementById("login-form-submit");
  const emailInput = document.getElementById("e-mail");
  const passwordInput = document.getElementById("password");
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
            console.log("Success! Welcome back!");
            window.alert("Success! Welcome back!");

            // Additional actions after successful login
            // For example, redirect to a different page
            // window.location.href = "/dashboard";
            // Or fetch additional user data, update UI, etc.
            // ...

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

function checkLoginStatus() {
  const auth = getAuth();

  const tempuser = auth.currentUser;
  if (tempuser.email === null) {
    console.log("not logged in");
    return;
  }
  tempuser.providerData.forEach((profile) => {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });

}
/**
 * Login for google
 * 
 * March 13, 2024
 * Alexander Evans
 */
export const googleSignin = () => {
  console.log("click");
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  auth.languageCode = 'it';

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("successfully logged in ", result.user.displayName);
      alert(`Successfully logged in: ${auth.user.displayName}`);
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
/*

const signupButton = document.getElementById("sign-up");

const main = document.getElementById("main");
const createacct = document.getElementById("create-acct")

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");


createacctbtn.addEventListener("click", function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  
  if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  
  if(isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      window.alert("Success! Account created.");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      window.alert("Error occurred. Try again.");
    });
  }
});

*/


/*

signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});

*/
/*


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct")

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

createacctbtn.addEventListener("click", function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  
  if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  
  if(isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      window.alert("Success! Account created.");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      window.alert("Error occurred. Try again.");
    });
  }
});

submitButton.addEventListener("click", function() {
  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Success! Welcome back!");
      window.alert("Success! Welcome back!");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    });
});

signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});

*/