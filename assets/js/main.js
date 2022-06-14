// Global variables
let formEl = document.querySelector("#search-form");
let pastSearch = document.querySelector("#past-search");
let searchBtn = document.querySelector("#search-btn");

let searchInfo = [];

/**************************************/
/** PSEUDOCODE FOR DROPDOWN FEATURES **/
/**************************************/
// When the page loads, there should be a dropdown menu for countries (to query COVID API)
// (starting with just US and CA for now)
// When the user picks a country code, they're given another drop down to pick region (state/province for COVID second query)
// the regional COVID stats print to the page
// city search form is displayed for further drill-down on Travel Places and Accuweather APIs
// results for Travel Places displayed
// date range for forecast?
// Accuweather data is displayed

// getting OpenTripMap
fetch('https://api.opentripmap.com/0.1/en/places/geoname?name=Austin&country=US&apikey=5ae2e3f221c38a28845f05b62f4bde6c0a2383785f9aafa5d94a8281')
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
    
// city seearch form
let searchFormHandler = function(event) {
    event.preventDefault();
    let searchInput = document.querySelector("input[id='searched-location']").value;
    
    console.log(searchInput);


   // checking if there is a valid input
    if (!searchInput) {
        alert("Please fill in a destination.")        
      return false;
    }
    
  // reset form for next search
  document.querySelector("input[id='searched-location']").value = "";
  
  // create object to pass to past searches and save function
  let searchInputObj = {
      city: searchInput
    }  
    
    searchInfo.push(searchInputObj);
    saveInfo();
}

// a card is displayed on the page in the Past Searches area

// save input as an object in localStorage
let saveInfo = function() {
    localStorage.setItem("searchInfo", JSON.stringify(searchInfo));
}



// search event listener
formEl.addEventListener("submit", searchFormHandler);