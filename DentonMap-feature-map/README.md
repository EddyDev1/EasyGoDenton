# DentonMap
[Dev-Installation]
npm install -g firebase-tools <-- only needs to be done once as it's global
npm install firebase
npm install --save-dev parcel
npm install --save @googlemaps/js-api-loader
npm install --save @googlemaps/adv-markers-utils


[database] :
You can still use PinLocation.latitude, PinLocation.longitude
There is an array of PinLocation objects exported from "firebaseReadLocations.js"

[firebaseLocationStructs.js] :
Contains empty database structs for PinLocation with structs <shape> and <user>
Notice that if you assign this struct, ie: let myobject = shape; 
Then myobject and shape will point to the same struct, thereby changing a myobject value will change a shape value.
These are empty structs for the purpose of entering an empty struct in the PinLocation constructor.


Usage: 
Import locations from "./firebaseReadLocations.js"
locations.forEach ( (object) => {
    latitude = object.latitude // or object.get_Longitude_Latitude(0)
    longitude = object.longitude // object.get_Longitude_Latitude(1)
});

The [PinLocation] class is an abstraction of accessible areas, and uses the locationid to determine whether the location exists or not.
When writing the [PinLocation] class to the database, use [writeRecordToFirestore()] method within the [PinLocation] class.
[PinLocation] uses locationid, which is the id of the location in the database.
If implemented improperly, then multiple pins in the same place may show.

[firebaseAuthenticationClass] :
Exports default <auth> object which contains a reference to the getAuth() request so we don't have to keep calling it.
Usage Example: onAuthStateChanged(auth.myauth, function handler() {});
Usage: const local_Auth = auth.myauth // returns auth object for user                

import: import auth from "../firebase/firebaseAuthenticationClass.js";

[uid] :
"object.uid" is the unique identifier assigned by firebase to a document.
Although each document will have a unique name, uid should be used to reference the document.
Once you grab the document, then you will be able to find the uid.

[locations-database] :
[locations-database-structure] :
Col       Doc      Col       Doc
locations/pin
users    /user.uid /locations /group

[locations-database-description] :
[I] :  
"locations" is a collection which contains all the points to write to the google map.

[II] :
"city": city.uid  
    "city" is a document which indicates the city that the locations are from
    name : <city-name>

[III] :
"pins" is a collection which contains the lat-long for google maps api to operate.
Shape and type determine the display on the google maps api.
Desc is a short string describing the object.

[IV] :
"pin" : pin.uid
    "pin" is a document which contains the latitude and longitude for google maps api operation.
    latitude:   <number>    required for expected google maps api behavior
    longitude:  <number>    required for expected google maps api behavior
    shape:      <enum>      shape that is drawn on the map
        radius:     <number>    radius of the shape, NULL if not appplicable
        length:     <number>    length (vertical) of the box, NULL if not applicable
        width:      <number>    length (horizontal) of the box, NULL if not applicable
    type:       <enum>          type of accessible locations
    desc:       <string>        description of the location
    users:      <object[]>  an array of the users who have contributed
        user.uid:   <user.uid>  unique userid assigned by firebase
        name:       <string>    name of the user


[user-database] :
Add user information here...


[accessible-location] :
Accessible location represents three types of places which the user may use.
1. Parking Space : This is a parking space for disabled persons
2. Accessible Button : Button to open the entrance

[Functional-requirements] : 
Each user shall be signed in anonymously to be able to drop locations on the map up to a max number (5).
    Toggle anonymous sign-in in the firebase console.
    !user.isAnonymous: condition to check if  the user is anonymous

A verified user shall be able to add, edit or delete a location through a webportal.

A verified user, with elevated permissions, shall be able to download a CSV or dataset of the current locations.
    
[JavaScript-Functions] :

[signOut]
signOut() : located in firebaseSignout.js, handles the signing out functions for the website (allows users to call auth firebase and signout very simple).

[initializeSigninButtons]
initializeSigninButtons() : flips the css for functions hiding things that are irrelevant to a user who is signed out. 
Vice versa, shows things which are relevant to users signed in.

[PARCEL] : Parcel npm module documentation for this project
Parcel bundles together front end code for a fast and easy to use front end. 
It helps us avoid things such as CORS.

Parcel Installation instructions:


[FIREBASE]: firebase documentation for this project

[FIREBASE]
Firebase installation commands:
    npm install -g firebase-tools
        This command installs firebase tools globally on your machine, allowing for use of firebase locally on your machine.
    
    npm install firebase
        installs firebase into local node modules

Firebase modules:
    firebaseConfiguration.js
        exports app and google analytics, firebase object
        sets the CDN and API to communicate with the Firebase backend.
        
