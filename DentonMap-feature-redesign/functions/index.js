/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const {onValueCreated} = require("firebase-functions/v2/database");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
// this file must not exposed to pulbic or github

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://denton-1cade-default-rtdb.firebaseio.com/",
});


const db = admin.database();

// Example function to get data from Realtime Database
exports.addUserIfMissing = onRequest(async (req, res) => {
  try {
    // Authenticate the incoming request using Firebase Authentication
    const authorizationHeader =
        req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      res.status(401).send("Authorization header is missing or malformed");
      return;
    }

    const idToken = authorizationHeader.split("Bearer ")[1];


    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedIdToken.email;
    if (!email) {
      res.status(401).send("Authentication information is missing or invalid");
      return;
    }

    const loweredEmail = email.toLowerCase();

    // Convert the UTF-8 encoded string to Base64
    const base64EncodedEmail = btoa(encodeURIComponent(loweredEmail));


    // Check if the user exists
    const userSnapshot = await db.ref(`Users/${base64EncodedEmail}`)
        .once("value");
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();

      // Check if the email section is missing
      if (!userData.email) {
        // Add the email section to the existing user object
        await db.ref(`Users/${base64EncodedEmail}`)
            .update({email: loweredEmail});
      }
    } else {
      // Create a new user object with the specified email and column
      const newUser = {
        email: loweredEmail,
      };
      await db.ref(`Users/${base64EncodedEmail}`).set(newUser);
    }

    res.status(200).json({
      message: "User data updated/checked successfully",
      email: loweredEmail,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error updating/checking user data");
  }
});

// Example function to write data to Realtime Database
// exports.writeData = functions.https.onRequest((req, res) => {
//     const newData = req.body;
//     db.ref('/data').push(newData)
//         .then(() => {
//             res.status(201).send('Data written successfully');
//         })
//         .catch(error => {
//             res.status(500).send(error);
//         });
// });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
