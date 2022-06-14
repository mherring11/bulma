// Global variables
let formEl = document.querySelector("#search-form");
let pastSearch = document.querySelector("#past-search");
let searchBtn = document.querySelector("#search-btn");

let searchInfo = [];

let searchFormHandler = function(event) {
    event.preventDefault();
    let searchInput = document.querySelector("input[id='searched-location']").value;
    
    console.log(searchInput);
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'X-RapidAPI-Key': '3eae715328mshb143a70646c62edp15e2fejsn7a76551cc96c',
    //         'X-RapidAPI-Host': 'travel-places.p.rapidapi.com'
    //     }
    // };
    
    // fetch('https://travel-places.p.rapidapi.com', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


    const covidOptions = {
        method: 'GET',
        headers: {
            'X-Authorization': '6179002e-6646-4852-be37-572758a58cbb',
            'X-RapidAPI-Key': '3eae715328mshb143a70646c62edp15e2fejsn7a76551cc96c',
            'X-RapidAPI-Host': 'covid-19-global-tracker-with-regional-data.p.rapidapi.com'
        }
    };
    
    fetch('https://covid-19-global-tracker-with-regional-data.p.rapidapi.com/api/covid/regionalDataByCountry/CA', covidOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

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