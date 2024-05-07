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
  map : null,
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
    apiKey: "YOUR_API_KEY",
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
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      // Sets the pointer to point towards the AdvancedMarkerElement class and PinElement class
      marker_ptr.adv = AdvancedMarkerElement;
      marker_ptr.pin = PinElement;
      marker_ptr.map = map;

      const card = document.getElementById("pac-card");
      const input = document.getElementById("pac-input");
      const biasInputElement = document.getElementById("use-location-bias");
      const strictBoundsInputElement = document.getElementById("use-strict-bounds");
      const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        latLngBounds: lockMap
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

      /* addMarker(map, mapOptions.center, 'i'); *//*  */      
      //drawRect(map);

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
        //marker.map = map; // stop search from adding marker to map
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
          autocomplete.setBounds(lockMap);
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

      // routes code
      directionsRenderer.setMap(map);

      const onChangeHandler = function () {
        directionsRenderer.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      };
    
      const gr = document.getElementById("get-route"), cr = document.getElementById("clear-route");

      if (gr) {
        gr.addEventListener("click", onChangeHandler);

        if (cr)
          cr.addEventListener("click", () => {
            directionsRenderer.setMap(null);
            document.getElementById("start-input").value = "";
            document.getElementById("end-input").value = "";
          });
      }

      var start_route = document.getElementById('start-input');
      var end_route = document.getElementById('end-input');

      var search_start = new google.maps.places.SearchBox(start_route, {
        bounds: lockMap
      });

      var search_end = new google.maps.places.SearchBox(end_route, {
        bounds: lockMap
      });     

      // Iterates through array locations[PinLocations] and adds the markers
      locations.forEach( (location) => {
          addMarker({ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }, 'i', location.get_description());
      })

      const toggle = document.getElementById('add-markers');
      google.maps.event.addListener(map, 'click', async function (event) {
        // writeLocationToFirestore(event.latLng.lat(), event.latLng.lng());

        if (toggle.innerText.substring(12) === "On")
        {
          await addMarker
          ( 
            { lat: event.latLng.lat(), lng: event.latLng.lng() }, 
            'm',
            await geocode({ location: event.latLng })
          );

          if (markers.length > 3) 
            removeAll();
        }
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

/**
 * Removes all the markers from the map and the corresponding divs unless a flag is set.
 * If add_Location flag is set, then markers[i].map != null
 * Does not remove marker to avoid them being take noff
 * @param {Number} add_Flag flag equals 0 or no param to indicate to remove markers from the map, otherwise leave the pins on the map
 */
function removeAll(add_Flag = 0) {
  for (let i = 0; i < markers.length; i++) {
    if (add_Flag == 0) markers[i].map = null;
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
async function addMarker(location, type, desc="No description") {    
  const info = new google.maps.InfoWindow();
  const AdvancedMarkerElement = marker_ptr.adv;
  const PinElement = marker_ptr.pin;

  //https://stackoverflow.com/questions/1484506/random-color-generator
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  const handicap = document.createElement("img");
  // handicap.innerHTML =
  //     `<img src="https://raw.githubusercontent.com/wajdialjedaani/DentonMap/redesign/src/nav-access.png?token=GHSAT0AAAAAACRAPWGGALG5JJ6FCZUPB4FKZRDESKA" style="width: 16px; height: 16px;" alt="">`;
  handicap.src = "https://pngimg.com/d/disabled_PNG6.png";
  handicap.style.width = '22px';

  const pin = new PinElement({
    background: getRandomColor(),
    glyph: handicap,
  });
  pin.borderColor = pin.background;

  const marker = new AdvancedMarkerElement({
    position: location,
    map: marker_ptr.map,
    title: desc,
    content: pin.element
  });

  if (type === 'i')
    initMarkers.push(marker);
  else if (type === 'm') {
    locationid = createDiv();

    let temp = document.getElementById("location-" + locationid.toString() + "-desc");
    let temp1 = document.getElementById("location-" + locationid.toString() + "-desc" + locationid.toString());

    temp.setAttribute('value',  desc);
    temp.style.width = `300px`;
    temp1.style.width = `300px`;

    marker.addListener("click", ({domEvent, latLng}) => {
      const { target } = domEvent;
      
      info.close();
      info.setContent(marker.title);
      info.open(marker.map, marker);
    });

    markers.push(marker);
  }
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


  path.setMap(marker_ptr.map);  
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

  rectangle.setMap(marker_ptr.map);
}

export function filterMap(type)
{
// our layers function where we filter out what shows on the map
  if (markers.length === 0 && initMarkers.length === 0) 
    return;

  switch (type)
  {
    case 'P':
      {
        for (let imark of initMarkers)
          if (!imark.title.includes("parking"))
            imark.map = null;
        
        for (let mark of markers)
          if (!mark.title.includes("parking"))
            mark.map = null;
      }
      break;
    case 'B':
      {
        for (let imark of initMarkers)
          if (!imark.title.includes("button"))
            imark.map = null;

        for (let mark of markers)
          if (!mark.title.includes("button"))
            mark.map = null;
      }
      break;
    case 'R':
      {
        for (let imark of initMarkers)
          imark.map = marker_ptr.map;

        for (let mark of markers)
          mark.map = marker_ptr.map;
      }
      break;
    default:
      break;
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
      console.log("onclick");
      let index = 1;
      // Passed to removeAll() to not remove markers from the map
      const doNotDelete = 1;
      // Add new markers to locations array
      markers.forEach( (item) => {
        locations.push(new PinLocation(item.position.lat, item.position.lng, getDescription(index)));
        index++;
      });
      
      batchWrite(locations);
      removeAll(doNotDelete);
    }
  }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const selectedMode = document.getElementById("mode").value;

  directionsService
    .route({
      origin: {
        query: document.getElementById("start-input").value,
      },
      destination: {
        query: document.getElementById("end-input").value,
      },
      travelMode: google.maps.TravelMode[selectedMode],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

async function geocode(request) {
  return new Promise((resolve, reject) => {
    geocoder = new google.maps.Geocoder();
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        resolve(results[0].formatted_address);
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  });
}
