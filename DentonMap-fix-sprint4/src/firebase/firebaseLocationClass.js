/**
 * Location class which produces a record
 * @param latitude latitude of a coordinate
 * @param longitude longitude of a coordinate
 * @param userid optional uid of a user, if there is not an id, then it is set to null.
 * @param locationid optional uid of the location, if there is not an id, then it is set to null.
 */
export default class Location {
    constructor (latitude, longitude, userid=null, locationid=null) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.userid = userid;
        this.locationid = locationid;
    }

    /**
     * Creates a record to store in a database
     * @return location record to store in firestore location collection
     */
    createRecord() {
        const locationRecord = {
            latitude : this.latitude,
            longitude : this.longitude,
            userid : this.userid
        }

        return locationRecord;
    }

    /**
     * Used to write the locationid under the user records.
     * @return uid object of the location record or null if there is no uid
     */
    getid() {
        // Creation of the object
        const locationRecord = {
            locationid : this.locationid
        }
        // returns an object with user.uid
        return locationRecord;
    }
}