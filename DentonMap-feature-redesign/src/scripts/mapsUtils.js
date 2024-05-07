/**
 * Extra page for maps.js to reduce merge conflicts
 * Contain utilities that depend on the map
 * 
 * April 16, 2024
 * Alexander Evans
 */



/**Location number tracker */
var locationAmt = 0;

/**
 * Gets the description from the input box when a description is added for the marker
 * @returns {string} input field in the desc box
 */
export const getDescription = (id) => {
    let location_id = "location-" + id + "-desc";
    const desc = document.getElementById(location_id).value;
    const desc1 = document.getElementById(location_id + id.toString()).value;

    return desc + "\n\n" + desc1;
}

/**
 * Creates a div when a new point is added on the map
 * @return id of the location
 * @throws an error if temp-location cannot be reached
 */
export const createDiv = () => {
    const temp_Location = document.getElementById("temp-location");
    if (!temp_Location) throw new Error("id=temp-location cannot be reached, createDiv(): %d", locationAmt + 1);


    // Set the current location number
    locationAmt++;

    const created_Div = document.createElement("div");
    let location_h3 = "Location " + locationAmt;
    let location_id = "location-" + locationAmt +"-desc";
    let created_Div_id = "created-" + locationAmt + "-div";

    created_Div.className = "temp-location-item";
    created_Div.id = created_Div_id;

/*     input_ids.push(location_id); */

    console.log("location_h3: ", location_h3);
    console.log("location_id: ", location_id);
    myHTML = `<h3>${location_h3}</h3><form><input type='text' class='location-desc' id='${location_id}' placeholder='Enter description here' maxlength=140><input type='text' class='location-desc' id='${location_id + locationAmt}' placeholder='Enter description here' maxlength=140></form>`;
    created_Div.innerHTML = myHTML;
    temp_Location.append(created_Div);

    return locationAmt;
}

/**
 * Deletes a div if a point on the map is destroyed
 * @param {number} id location to delete
 * @throws a new error if the function cannot grab the div
 */
export const deleteDiv = (id) => {
    // construct the id of the location
    let div_id = "created-" + id + "-div";
/*     let location_id = "location-" + id + "-desc"; */

    // Remove the id from the input_ids array
/*     const index = input_ids.indexOf(location_id);
    if (index > -1) input_ids.splice(index, 1); // is present, then remove */

    const temp_Location = document.getElementById(div_id);
    if (!temp_Location) throw new Error("Cannot grab the div deleteDiv(): ", id);
    temp_Location.remove();
    locationAmt--;

    return;
}