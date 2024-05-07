/**
 * Desc: Google Maps API to load and update the Google Map
 * Author: Edward Asante
 * 
 * March 18, 2024
 * 
 * Changelog:
 * > Created file
 * > Added initMap()
 * > Removed initMap() in favor of npm js-api-loader (const loader)
 * > Added marker functions which are subject to change
 */

// google maps api
import { Loader } from '@googlemaps/js-api-loader';
import { Marker } from "@googlemaps/adv-markers-utils";
// adds lat, long, uid doc to firestore

import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore } from "../firebase/firebaseRepository.js";

let markers = [];

export const loadMap = () => {
  const loader = new Loader({
    apiKey: "AIzaSyDRk4DsR-vRdjPoVoUXZ35A6MZ2bXLx0Eo",
    version: "weekly",
  });

  // The map needs center and zoom while marker needs mapId
  const mapOptions = {
    center: { lat: 33.20749394834729, lng: -97.15259518475172 },
    zoom: 15,
    mapId: "DEMO_MAP_ID"
  }

    loader
    .importLibrary('maps')
    .then(async ({Map}) => {
      const map = new Map(document.getElementById("map"), mapOptions);
      await google.maps.importLibrary('marker');

      // addMarker(map, mapOptions.center);
      // readLocationsFromFirestore()
      // .then( (locations) => {
      //   locations.forEach((location) => {

      //       addMarker(map, { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) });
      //   })
      // })

      let count = 0;
      google.maps.event.addListener(map, 'click', function (event) {
        // writeLocationToFirestore(event.latLng.lat(), event.latLng.lng());
        addMarker(map, event.latLng);
        ++count;
        draw(map, count);
      });

      drawRect(map);
      
      //removeMarker(map, mapOptions.center);
    })
    .catch((e) => {
      console.error("There was an error with loading the map: ", e);
  });

}

// async function addMarker(map, location, locationId) {
//   const marker = new Marker({map, position: location});
//   marker.title = locationId;
//   markers.push(marker);
// }

function removeMarker(location) {
  for (let marker of markers)
    if (marker.position === location)
    {
      marker.position = null;
      deleteLocationFromFirestore(marker.title)
      .then(result => {
        // TODO: do something 
      })
      .catch(err => {
        // TODO: do something
      });
    }

}

async function addMarker(map, location) {
  const marker = new Marker({map, position: location});
  markers.push(marker);
}

async function draw(map, count)
{
  let pathCoords = [];
  
  for(let marker of markers)
    pathCoords.push(marker.position);

  if (count < 3)
  {
    pathCoords.push(pathCoords[0]);
    const path = new google.maps.Polyline({ 
      path: pathCoords,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    path.setMap(map);
  }
  else
  {
    const path = new google.maps.Polygon({
      paths: pathCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });

    path.setMap(map);
  }
}

async function drawRect(map) {
  const bounds = {
    east: -97.15001313018797,
    north: 33.20889816182732,
    south: 33.20625104843174,
    west: -97.15516931915285,
  };

  // Define a rectangle and set its editable property to true.
  const rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true,
  });

  rectangle.setMap(map);

  // listen to changes
  ["bounds_changed", "dragstart", "drag", "dragend"].forEach((eventName) => {
    rectangle.addListener(eventName, () => {
      console.log({ bounds: rectangle.getBounds()?.toJSON(), eventName });
    });
  });
}