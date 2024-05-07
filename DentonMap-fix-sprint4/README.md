# DentonMap

[Dev-Installation]
npm install -g firebase-tools
npm install firebase
npm install --save-dev parcel-bundler
npm install --save @googlemaps/js-api-loader


Tags:

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
        
