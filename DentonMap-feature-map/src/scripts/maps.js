/**
 * Desc: Google Maps API to load and update the Google Map
 * Author: Edward Asante
 * Contributer: Alexander Evans
 * April 16, 2024
 * 
 * Changelog:
 * April 16, 2024
 * > Changed markers to AdvancedMarkers
 * 
 * April 15, 2024
 * > Added initializeLocationsMap() which sets the global variable locations to point to the locations array in the main scope
 * >> locations changing in this scope will affect main() which is what we want!
 * > Added in pinSubmit() which will submit the locations into Firebase when the "submit locations" button is clicked
 * >> This function will clear markers and add them onto the locations array
 * >> locations[] is changed in the main scope after this happens!
 * 
 * > Created file
 * > Added initMap()
 * > Removed initMap() in favor of npm js-api-loader (const loader)
 * > Added marker functions which are subject to change
 */

/**
 * Debugging Doc:
 * Map reloads on deleteAll()?
 */
// google maps api
import { Loader } from '@googlemaps/js-api-loader';
import { Marker } from "@googlemaps/adv-markers-utils";
// adds lat, long, uid doc to firestore

import { writeLocationToFirestore, readLocationsFromFirestore, deleteLocationFromFirestore } from "../firebase/firebaseRepository.js";
import PinLocation from '../firebase/firebaseLocationClass.js'; // Locations from firestore 
import { batchWrite } from '../firebase/firebaseRepository.js'; // batchWrite([PinLocation]) writes to firebase all of the objects
import { getDescription, createDiv, deleteDiv } from './mapsUtils.js'; // Creates and manages the description box for pins



// locations is an array containing PinLocation objects which is passed before main() occurs
let initMarkers = [], markers = [], polygons = [], locations = null;

// Pointer structure for AdvancedMarkerPin and PinElement - structs are pointers in JS
const marker_ptr = {
  adv : null,
  pin : null,
};

// Id of locations that are being dynamically created
var locationid = 0
// The actual amount of ids
var trueAmount = 0;


/**
 * imports the location array from app.js
 * Runs before anything else in main()
 * @param {[PinLocation]} array locations array from app.js
 */
export const initializeLocationsMap = (array) => {
  locations = array;
}

/**
 * Loads the map up
 */
export const loadMap = () => {
  const loader = new Loader({
    apiKey: "AIzaSyDRk4DsR-vRdjPoVoUXZ35A6MZ2bXLx0Eo",
    version: "weekly",
  });

  const lockMap = {
    south: 33.11438531734807, 
    west: -97.27997003936769, 
    north: 33.35833110008682, 
    east: -97.02538697052
  };

  // The map needs center and zoom while marker needs mapId
  const mapOptions = {
    center: { lat: 33.20749394834729, lng: -97.15259518475172 },
    zoom: 15,
    mapId: "DENTON_ACESSIBILITY_MAP",
    restriction: {
      latLngBounds: lockMap,
      strictBounds: false,
    },
    mapTypeControl: false
  }


  const mapdiv = document.getElementById("map");

  if (mapdiv) {
    loader
    .importLibrary('maps')
    .then(async ({Map}) => {
      const map = new Map(mapdiv, mapOptions);
      await google.maps.importLibrary('places');
      // Import AdvancedMarkerElement and PinElement
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
      // Sets the pointer to point towards the AdvancedMarkerElement class and PinElement class
      marker_ptr.adv = AdvancedMarkerElement;
      marker_ptr.pin = PinElement;

      const card = document.getElementById("pac-card");
      const input = document.getElementById("pac-input");
      const biasInputElement = document.getElementById("use-location-bias");
      const strictBoundsInputElement = document.getElementById("use-strict-bounds");
      const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
      };
    
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    
      const autocomplete = new google.maps.places.Autocomplete(input, options);
    
      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      autocomplete.bindTo("bounds", map);
    
      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById("infowindow-content");
    
      infowindow.setContent(infowindowContent);

      addMarker(map, mapOptions.center, 'i');      
      drawRect(map);

      const marker = new AdvancedMarkerElement({ map });

      autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.map = null;
    
        const place = autocomplete.getPlace();
    
        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
    
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
    
        marker.position = place.geometry.location;
        marker.map = map;
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent =
          place.formatted_address;
        infowindow.open(map, marker);
      });
    
      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener(id, types) {
        const radioButton = document.getElementById(id);
    
        radioButton.addEventListener("click", () => {
          autocomplete.setTypes(types);
          input.value = "";
        });
      }
    
      setupClickListener("changetype-all", []);
      setupClickListener("changetype-address", ["address"]);
      setupClickListener("changetype-establishment", ["establishment"]);
      setupClickListener("changetype-geocode", ["geocode"]);
      setupClickListener("changetype-cities", ["(cities)"]);
      setupClickListener("changetype-regions", ["(regions)"]);
      biasInputElement.addEventListener("change", () => {
        if (biasInputElement.checked) {
          autocomplete.bindTo("bounds", map);
        } else {
          // User wants to turn off location bias, so three things need to happen:
          // 1. Unbind from map
          // 2. Reset the bounds to whole world
          // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
          autocomplete.unbind("bounds");
          autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
          strictBoundsInputElement.checked = biasInputElement.checked;
        }
    
        input.value = "";
      });
      strictBoundsInputElement.addEventListener("change", () => {
        autocomplete.setOptions({
          strictBounds: strictBoundsInputElement.checked,
        });
        if (strictBoundsInputElement.checked) {
          biasInputElement.checked = strictBoundsInputElement.checked;
          autocomplete.bindTo("bounds", map);
        }
    
        input.value = "";
      });

      // Iterates through array locations[PinLocations] and adds the markers
      locations.forEach( (location) => {
          addMarker(map, { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }, 'i', location.get_description());
      })

      google.maps.event.addListener(map, 'click', async function (event) {
        // writeLocationToFirestore(event.latLng.lat(), event.latLng.lng());
        await addMarker(map, { lat: event.latLng.lat(), lng: event.latLng.lng() }, 'm');
        draw(map);
        if (markers.length > 3)
          removeAll();
        });  
      })
      .catch((e) => {
        console.error("There was an error with loading the map: ", e);
    });
  }
}

function removeMarker(location, type) {
  if (type === 'i')
  {
    for (let marker of initMarkers)
    {
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
  }
  else if (type === 'm')
  {
    for (let marker of markers)
    {
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
  }

}


function removeAll() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].map = null;
    deleteDiv(i+1);
  }

  for (let polygon of polygons)
    polygon.setMap(null);

  polygons = [];
  markers = [];
  locationid = 0;

}

/**
 * Adds a marker to the google map in index.html
 * Added parameter desc which is a description of the location, this description will also go into the database
 * @param {*} map 
 * @param {*} location 
 * @param {*} type 
 * @param {string} desc 
 */
async function addMarker(map, location, type, desc="No description") {
  //const marker = new Marker({map, position: location, title: "God forbid I get a window to open"});
  // markers.push(marker);

  ///* 
    const mark = {
      position: location, 
      title: desc,
    };
    
  const info = new google.maps.InfoWindow();
  const AdvancedMarkerElement = marker_ptr.adv;
  const marker = new AdvancedMarkerElement({
    position: location,
    map,
    title: desc
  });

  if (type === 'i')
    initMarkers.push(marker);
  else if (type === 'm') {
    locationid = createDiv();
    markers.push(marker);
  }
  marker.addListener("click", ({domEvent, latLng}) => {
    const { target } = domEvent;
    
    info.close();
    info.setContent(marker.title);
    info.open(marker.map, marker);
  });
}

async function draw(map)
{
  let pathCoords = [];
  let path;
  
  for(let marker of markers)
    pathCoords.push(marker.position);

  path = new google.maps.Polygon({
    paths: pathCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });


  path.setMap(map);  
  polygons.push(path);
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
}

async function filter(type)
{
// our layers function where we filter out what shows on the map
  if (markers.length === 0 && polygons.length === 0)
    return;

  const save = markers[0].map;

  if (type !== "reset")
  {
    for (let i = 0; i < markers.length; i++)
      if (type !== markers[i].tag)
        markers[i].map = null;

    for (let polygon of polygons)
      if (type !== polygon.tag)
        polygon.setMap(null);
  }
  else
  {
    for (let polygon of polygons)
      if (polygon.map === null)
        polygon.setMap(save);

    for (let marker of markers)
      if (marker.map === null)
        marker.map = save
  }
}

// markers contains the new pins
// Create new Database pins
// I'll push everything
// Add event listener
/**
 * Submits all the pins on the map to firestore
 * Empties markers[] array after submittion
 * Acts asynchronously 
 */
export const pinSubmit = () => {
  // Empty shape
  const shape = {
    type: 0,
    value: 0,
    width: 0
  }
  // Empty user
  const user = {
    userid: null,
    userName: null
  }

  const submitLocation = document.getElementById("submit-locations");
  // Clear the markers buffer
  // Turn the latlong from markers[] into PinLocation objects
  // Push the new PinLocation objects onto the locations array
  if (submitLocation) {
    submitLocation.onclick = () => {
      let index = 1;
      // Add new markers to locations array
      markers.forEach( (item) => {
        locations.push(new PinLocation(item.position.lat, item.position.lng, getDescription(index)));
        index++;
      });
      
      batchWrite(locations);
      removeAll();
    }
  }
}