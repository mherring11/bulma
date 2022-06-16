// Global variables
var formEl = document.querySelector("#search-form");
var pastSearch = document.querySelector("#past-search");
var countrySelCont = document.querySelector("#countrySelCont");
var regionSelCont = document.querySelector("#regionSelCont");
var covidElHolder = document.querySelector("#covidElHolder");
var openTripEl = document.querySelector("#places-section");


var searchInfo = [];
var covidData = [];
console.log(covidData);

// pulls country code from selected country
var countrySelection = function(event){
    if (covidElHolder.children.length > 2){
        covidElHolder.removeChild(covidElHolder.lastElementChild);
    };

    if (regionSelCont.children.length >= 1) {
        regionSelCont.removeChild(regionSelCont.lastElementChild);    
    };

    console.log(event.target)
    var codeFinder = document.querySelector(".country-drop");
    codeFinder.addEventListener("click", console.log(event.target.value));
        var countryCode = event.target.value;
    if (countryCode !== "select country" && countryCode !== "select region"){

        regionsFinder(countryCode);
    } 
};

// fetches covid API to get selected country regions
var regionsFinder = function(code){
    
    var covidOptions = {
        method: 'GET',
        headers: {
            'X-Authorization': '6179002e-6646-4852-be37-572758a58cbb',
            'X-RapidAPI-Key': '3eae715328mshb143a70646c62edp15e2fejsn7a76551cc96c',
            'X-RapidAPI-Host': 'covid-19-global-tracker-with-regional-data.p.rapidapi.com'
        }
    };
    
    fetch('https://covid-19-global-tracker-with-regional-data.p.rapidapi.com/api/covid/regionalDataByCountry/' + code, covidOptions)
        .then(function(response){
            if (response.ok){                    
                response.json().then(function(data){
                    console.log(data.data);
                    console.log(data.data.length);
                    if (data.data.length === 0) {
                        covidData.splice(0, covidData.length);                            
                        covidDisplay();
                    } else {
                        covidData.splice(0, covidData.length);
                        covidData.push(data);
                        regionsBuilder(data);
                    }
                })
            }
        });   
};

// creates new drop down menu with selected countries regions
var regionsBuilder = function(data){
    
        if (regionSelCont.children.length >= 1) {
            regionSelCont.removeChild(regionSelCont.lastElementChild);
        };
    var region = document.createElement("select");
    region.className = ("dest-select");
    region.setAttribute("id", "region");
    region.setAttribute("name", "region");
    regionSelCont.appendChild(region);

    var regionElHolder = document.createElement("option")
    regionElHolder.textContent = ("select region");
    region.appendChild(regionElHolder);
    console.log(data);

    for (var i=0; i<data.data.length; i++){
        var regionEl = document.createElement("option");
        regionEl.className = ("region-drop");
        regionEl.setAttribute("value", data.data[i].regionName);
        regionEl.textContent = data.data[i].regionName
        region.appendChild(regionEl);
        console.log(data.data[i].regionName);
    }
};

// displays any covid numbers related to the selected region and a notification if there is no data
var covidDisplay = function(event){
    if (covidElHolder.children.length > 2){
        covidElHolder.removeChild(covidElHolder.lastElementChild);    
    } 
    if (covidData.length === 0){
        var noCovidStats = document.createElement("p");
        noCovidStats.textContent = "Unfortunately, there is no Covid information available for this location.";
        covidElHolder.appendChild(noCovidStats);
        return; true
    };
    
    var regionChoice = event.target.value;

    if (regionChoice !== "select region") {
        covidData[0].data.findIndex(function(element){
            if(element.regionName === regionChoice){
                console.log(element);
                console.log(element.regionName);
                console.log(regionChoice);
                var covidStats = document.createElement("p");
                covidStats.setAttribute("style", "white-space: pre;");
                covidStats.textContent = element.regionName + "\n\ Total Case Count to Date: " + element.casesCount + "\n\ Recovered Cases: " + element.recoveredCount + "\n\ Deaths: " + element.deceasedCount;
                covidElHolder.appendChild(covidStats);
            }      
        });   
    }           
};

// city search form handler
var searchFormHandler = function(event) {
    event.preventDefault();
    var searchInput = document.querySelector("input[id='searched-location']").value;
    searchInput = searchInput.trim();
    
    // checking if there is a valid input
    if (searchInput) {
        // send city name to OpenTrip handler
        openTripHandler(searchInput);
    } else {    
        alert("Please fill in a destination.")        
    }

    // reset form for next search
    document.querySelector("input[id='searched-location']").value = "";
    
    // create object to pass to past searches and save function
    var searchInputObj = {
        city: searchInput
    }  
    
    // pushing to searchInfo array (is this step necessary?) How do we add country code from dropdown to this object?
    searchInfo.push(searchInputObj);
    // save array to localStorage
    saveInfo(searchInfo);
}

var openTripHandler = function(city) {
  // formats any city which has two or more words so that it's acceptable in the URL
  city = city.replace(" ", "%20");
    // getting OpenTripMap basic city data (longitude and latitude are needed to get other datapoints)
    fetch("https://api.opentripmap.com/0.1/en/places/geoname?name=" + city + "&country=US&apikey=5ae2e3f221c38a28845f05b62f4bde6c0a2383785f9aafa5d94a8281")
        .then(function(response) {
          if (response.ok) {
            response.json().then(function(data) {
              getVariables(data);
            });
          } else {
            alert("Error: No data found.");
          }
        })
        .catch(function(error) {
          console.log(error);
        });

    // getting the lon and lat for the second fetch
    var getVariables = function(location) {
      var lon = location.lon
      var lat = location.lat
      // setting limit to 10 items being returned by this fetch
      var newApiUrl = "https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=" + lon + "&lat=" + lat + "&kinds=historic,natural,cultural,amusements&limit=10&apikey=5ae2e3f221c38a28845f05b62f4bde6c0a2383785f9aafa5d94a8281";

      fetch(newApiUrl)
        .then(function(response) {
            response.json().then(function(data) {
            displayOpenTrip(data);
        })
        .catch(function(error) {
          console.log(error);
        });
      });
    } 
}

var displayOpenTrip = function(cityInfo) {
  // clear existing data
  openTripEl.textContent = ""

  // cycle through each item in cityInfo to get the names of the places and their XID for the info and img
  for (var i = 0; i < cityInfo.features.length; i++) {
    if (cityInfo.features[i].properties.name != "") {
      // creating more variables for yet a third fetch
      var itemName = cityInfo.features[i].properties.name;
      var itemXid = cityInfo.features[i].properties.xid;
      var getInfoUrl = "https://api.opentripmap.com/0.1/en/places/xid/" + itemXid + "?apikey=5ae2e3f221c38a28845f05b62f4bde6c0a2383785f9aafa5d94a8281"
      // console.log(getInfoUrl);
        fetch(getInfoUrl)
          .then(function(response) {
            response.json().then(function(data) {
              displayItemInfo(data);
            })
          .catch(function(error) {
            console.log(error);
          });
        });
      
      var displayItemInfo = function(itemData) {
        console.log(itemData, itemData.name, itemData.image);
        // clear existing content
      

        // create divs for Places cards
        var infoCardEl = document.createElement("div")
        infoCardEl.classList = "card place-cards";
        openTripEl.appendChild(infoCardEl);

        // display place name on card
        var cardNameEl = document.createElement("h4");
        cardNameEl.classList = "title is-size-6 is-spaced mb-3";
        cardNameEl.textContent = itemData.name;
        infoCardEl.appendChild(cardNameEl);

        // display place image on card
        var placeImgEl = document.createElement("figure");
        placeImgEl.classList = "image";
        placeImgEl.innerHTML = "<img src='itemData.image' alt=''></img>";
        infoCardEl.appendChild(placeImgEl);

      }

    }
  }

 

}

    
// a card is displayed on the page in the Past Searches area
    
// save input as an object in localStorage
var saveInfo = function() {
    localStorage.setItem("searchInfo", JSON.stringify(searchInfo));
}



// search event listener
formEl.addEventListener("submit", searchFormHandler);
// event listener for country selector 
countrySelCont.addEventListener("change", countrySelection);
// event listener for regional covid display function
regionSelCont.addEventListener("change", covidDisplay);

// Burger menus
document.addEventListener('DOMContentLoaded', function() {
  // open/close
  const toggler = document.querySelectorAll('[data-toggle="side-menu"]');

  if (toggler.length) {
      for (var i = 0; i < toggler.length; i++) {
          const target = toggler[i].getAttribute('data-target');

          if (target.length) {
              toggler[i].addEventListener('click', function(event) {
                  event.preventDefault();
                  const menu = document.querySelector(target);
      
                  if (menu) {
                      menu.classList.toggle('is-hidden');
                    }
                });
            }
        }
    }
});