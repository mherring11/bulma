// Global variables
let formEl = document.querySelector("#search-form");
let pastSearch = document.querySelector("#past-search");
let searchBtn = document.querySelector("#search-btn");
let countryRegionSelect = document.querySelector("#countryRegionSelect");

let searchInfo = [];

let countrySelection = function(event){
    console.log(event.target)
    let codeFinder = document.querySelector(".dropDown");
    codeFinder.addEventListener("click", console.log(event.target.value));
        let countryCode = event.target.value
    if (codeFinder !== undefined){

        regionBuilder(countryCode);
    } 
};

let regionBuilder = function(code){
    
    let covidOptions = {
        method: 'GET',
        headers: {
            'X-Authorization': '6179002e-6646-4852-be37-572758a58cbb',
            'X-RapidAPI-Key': '3eae715328mshb143a70646c62edp15e2fejsn7a76551cc96c',
            'X-RapidAPI-Host': 'covid-19-global-tracker-with-regional-data.p.rapidapi.com'
        }
    };
    
    fetch('https://covid-19-global-tracker-with-regional-data.p.rapidapi.com/api/covid/regionalDataByCountry/' + code, covidOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
        
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


countryRegionSelect.addEventListener("click", countrySelection);