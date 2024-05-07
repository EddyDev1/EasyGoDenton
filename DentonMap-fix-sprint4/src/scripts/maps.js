/**
 * 
 * 
 */

import { Loader } from "@googlemaps/js-api-loader";

let map;

const loader = new Loader({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
});

loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  let location = {
    lat: -34.300,
    lng: 150.214
  };

  

});

function addMarker(location) {
  let marker = new google.maps.Marker({
    map: map,
    position: location
  })
}

// or

async function placeMarker(location) {
  const { AdvanceMarkerElement } = await google.maps.importLibrary("marker");
  const marker  = new AdvanceMarkerElement({
    map,
    position: location
  });
}

