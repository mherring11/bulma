// Global variables
let formEl = document.querySelector("#search-form");
let pastSearch = document.querySelector("#past-search");
let searchBtn = document.querySelector("#search-btn");
let countrySelCont = document.querySelector("#countrySelCont");
let regionSelCont = document.querySelector("#regionSelCont");

let searchInfo = [];
let covidData = [];
console.log(covidData);

// pulls country code from selected country
let countrySelection = function(event){
    console.log(event.target)
    let codeFinder = document.querySelector(".country-drop");
    codeFinder.addEventListener("click", console.log(event.target.value));
        let countryCode = event.target.value;
    if (countryCode !== "select country" && countryCode !== "select region"){

        regionsFinder(countryCode);
    } 
};

// fetches covid API to get selected country regions
let regionsFinder = function(code){
    
    let covidOptions = {
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
                            noCovidData(data);
                        }
                        else if (covidData.length !== 0) {
                            covidData.splice(0, covidData.length);
                        };
                        covidData.push(data);
                        regionsBuilder(data);
                    })
                }
            })       
};

let noCovidData = function(data){
    
}

// creates new drop down menu with selected countries regions
let regionsBuilder = function(data){
    let regionSelCont = document.querySelector("#regionSelCont")
        if (regionSelCont.children.length >= 1) {
            regionSelCont.removeChild(regionSelCont.lastElementChild);
        };
    let region = document.createElement("select");
    region.className = ("dest-select");
    region.setAttribute("id", "region");
    region.setAttribute("name", "region");
    regionSelCont.appendChild(region);

    let regionElHolder = document.createElement("option")
    regionElHolder.textContent = ("select region");
    region.appendChild(regionElHolder);
    console.log(data);

    for (var i=0; i<data.data.length; i++){
        let regionEl = document.createElement("option");
        regionEl.className = ("region-drop");
        regionEl.setAttribute("value", data.data[i].regionName);
        regionEl.textContent = data.data[i].regionName
        region.appendChild(regionEl);
        console.log(data.data[i].regionName);
    }
};

let covidDisplay = function(event, data){
    // debugger;
    console.log(event.target);
    let regionFinder = document.querySelector(".region-drop");
    regionFinder.addEventListener("click", console.log(event.target.value));
    let regionChoice = event.target.value;
    
    if (regionChoice !== "select region") {
        covidData[0].data.findIndex(function(element){
            if(element.regionName === regionChoice){
                console.log(element.regionName);
                console.log(regionChoice);
                return true;
            }
            return false;
        });

        
    }           
}

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
// event listener for country selector 
countrySelCont.addEventListener("click", countrySelection);
// event listener for regional covid display function
regionSelCont.addEventListener("click", covidDisplay);

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
