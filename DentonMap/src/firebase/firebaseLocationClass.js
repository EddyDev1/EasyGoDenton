import { onAuthStateChanged } from "firebase/auth";
import { DocumentReference, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "./firebaseConfiguration";
import auth from "./firebaseAuthenticationClass";

/**
 * PinLocation class which represents one pin
 * 
 * Only required value is latitude and longitude, everything else is optional
 * 
 * 
 * @param {number} latitude latitude of the location
 * @param {number} longitude longitude of the location

 * @param {string} desc description of the location 
 * @param {string} locationid uid of the location document
 * @param {string} username username of the user
 * @param {uid_t} user user id of the object
 */
export default class PinLocation {

    // Parameters
    latitude;
    longitude;
    // locationid of the pin for google maps api
    locationid;

    // shape type
    shape = 0;
    // Userid 
    userid = "";
    // Username
    username = "";
    // Description
    desc = "";

    // Constructors
    constructor (latitude, longitude, desc="", locationid=null, username="", userid="") {
        // Sets the latitude and longitude to the passed parameters
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationid = locationid;
        this.username = username;
        this.userid = userid;
        this.desc = desc;
    }

    // Methodology
    /**
     * Creates a record to store in a database
     * @return location record to store in firestore location collection
     */
    createRecord() {
        const locationRecord = {
            isPinLocation : true,
            latitude : this.latitude,
            longitude : this.longitude,
            shape : this.shape,
            user : this.username,
            userid : this.userid,
            desc : this.desc
        }

        return locationRecord;
    }

    /**
     * Writes the current instance to firestore or updates the document if it has been updated
     * Currently will only write a new instance to firestore creating duplicate instances
     * @returns a promise containing the locationid of the newly written object
     */
    writeRecordToFirestore() {
        return new Promise ( (resolve) => {
            onAuthStateChanged(auth.myauth, (user) => {
                // Collection reference object for the locations collection in firestore
                let collection_Reference = null;
                // Collection Path for object creation
                let collection_Path = "locations"
                // doc reference object for the doc in firestore
                let doc_Reference = null;
                // Path for the doc in firebase
                let doc_Path = "";
                // Record to write to the database
                let record = null;
                
                // If the user is not logged in, then return an error [BREAKPOINT]
                if (!user || user.isAnonymous) {
                    // Throw an error that the user is not logged in
                    throw new Error("User is not logged in.");
                }

                // Create the record to store in Firebase
                record = this.createRecord();
                console.log (record);

                // For locations that exist, overwrite the old information
                if (this.locationid) {
                    doc_Path = `locations/${this.locationid}`;
                    try {
                        doc_Reference = doc(firestoreDb, doc_Path);
                    }
                    catch (error) {
                        console.error("An error has occured grabbing a created document in writeRecordToFirestore: %d: ", this.locationid, error);
                    }

                    setDoc(doc_Reference, record)
                    .then ( () => {
                        console.log("Location: successfuly edited\n", this.locationid);
                    })
                    .catch( (error) => {
                        console.error("An error has occured while attempting to overwrite a location within writeRecordToFirestore():", error);
                    })
                }
                // If this location does not exit, assign the locationid
                else {
                    this.userid= user.uid;
                    record.userid = user.uid;
                    collection_Path = "locations";  
                    try {
                        collection_Reference = collection(firestoreDb, collection_Path);
                    }
                    catch (error) {
                        console.error("An error has occured while creation a document reference in writeRecordToFirestore: ", error);
                    }   
                    
                    addDoc(collection_Reference, record)
                    .then ( (docRef) => {
                        console.log("Successfully wrote: ", docRef.id);
                        this.locationid = docRef.id;
                    })
                    .catch ( (error) => {
                        console.error("An error has occured while creating a new location in writeRecordToFirestore()");
                    });
                }   
                
                // Resolve location id
                resolve(this.locationid);
            });
        });
    }
    
    // Getting and Setting
    /**
     * Used to write the locationid under the user records.
     * @return uid object of the location record or null if there is no uid
     */
    get_userid() {
        return this.user.userid;
    }

    /**
     * Sets the id
     * @param {uid_t} id user.uid of the user who entered the location
     * @returns false if id is not null, true if id is null
     */
    set_userid(id) {
        this.userid = id;
    }

    /**
     * Gets the unique location id
     * @returns location id
     */
    get_locationid () {
        return this.locationid;
    }

    /**
     * Sets the location id
     * @returns true if the setting is successful, false otherwise
     */
    set_locationid (id) {
        return new Promise( (resolve) => {
            let success = false;

            // Checks if there is an id
            if (id) {
                this.locationid = id;
                success = true;
            }

            resolve(success);
        });
    }

    /**
     * Gets the current location
     * @resolve pin that containts lat and long
     */
    getLocation() {
        return new Promise( (resolve) => {
            // exit point for no latitude or longitude
            if (this.latitude == 0 || this.longitude == 0) {
                resolve(null);
            }

            // pin holding the longitude and latitude
            const pin = {
                latitude : this.latitude,
                longitude : this.longitude
            }
            
            // return
            resolve(pin);
        });
    }

    /**
     * Returns the latitude or longitude
     * @param isLat false for longitude, true for latitude
     * @return the latitude or longitude
     */
    get_Latitude_Longitude(isLat) {
        let returnValue = 0;
        // Checks for the return type, lat or long
        if (isLat) {
            returnValue = this.latitude;
        }
        else
            returnValue = this.longitude;
        return returnValue;
    }

    /**
     * Sets latitude or longitude
     * @param isLat false for longitude, true for latitude
     * @return success or failure
     */
    set_Latitude_Longitude(value, isLat) {
        let success = false;

        // Check for the return type, lat or long
        if (isLat) {
            this.latitude = value;
            success = true;
        }
        else {
            this.longitude = value;
            success = true;
        }

        return success;
    }

    /**
     * Returns the shape object
     * @returns shape object
     */
    get_shape() {
        return this.shape;
    }

    /**
     * Sets the shape around the pin
     * @param type type of shape: 0-circle, 1-square or 2-rectangle
     * @param lengthOrRadius length or radius of the shape
     * @param width width if recetangle
     * @returns success or failure
     */
    set_shape(type, lengthOrRadius, width) { 
        return new Promise ( (resolve) => {
            let success = true;
            // Checks if the inputs are valid
            if (type < -1 || type > 3) {
                resolve (false);
            }
            else if (lengthOrRadius <= 0) {
                resolve (false);
            }
            else if (type === 2 && width <= 0) {
                resolve (false);
            }

            // circle or square
            this.shape.type = type;
            this.shape.value = lengthOrRadius;

            // rectangle
            if (type === 2) {
                this.shape.width = width;
            }

            resolve(success);
        });
    }// set shape



    /**
     * Grabs the radius or length
     * @returns radius or length value
     */
    get_radius_length() {
        return this.shape.value;
    }

    /**
     * Grabs the width value if it exists
     * @returns the width value or null if it does not exist
     */
    get_width() {
        return this.shape.width;
    }

    /**
     * Get user name
     * @returns the username
     */
    get_username() {
        return this.user.user_Name;
    }

    /**
     * Sets the user name
     * @returns success or failure (bool)
     */
    set_username(name) {
        let success = false;
        if (name) {
            this.user.user_Name = name;
            success = true;
        } 
        
        return success;
    }

    /**
     * Gets the description
     */
    get_description() {
        return this.desc;
    }

    /**
     * Sets the description
     * @param {string} desc description to save 
     * @throws if desc is null (but not empty)
     */
    set_description(desc) {
        if (!desc) {
            throw new Error("Cannot have a null desc: did you mean <\"\">?");
        }

        this.desc = desc;
    }

    /**
     * Sets the description to an empty string
     */
    clear_description() {
        this.desc = "";
    }
}