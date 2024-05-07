/**
 * Class which contains a singleton for Firebase Authentication, rather than having to recall auth() everytime, it is called once in main.
 * 
 * March 23, 2024
 * Alexander Evans
 */

import {getAuth} from "firebase/auth";
/**
 * Singleton object for auth. Cannot be instantiated. Can be referenced by whoever references the object
 */
class FirebaseAuthentication {
    constructor() {
        if (FirebaseAuthentication.instance == null) {
            FirebaseAuthentication.instance = this;
            // authentication object from firebase
            this.myauth = getAuth();
        }
        return FirebaseAuthentication.instance;
    }
}

const auth = new FirebaseAuthentication();
Object.freeze(auth);
export default auth;