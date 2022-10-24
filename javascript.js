
const domManip = (() => {
    const searchButton = document.querySelector(".search-button");
    const clearButton = document.querySelector(".reset-button");
    searchButton.addEventListener("click", fetchCurrentWeather);
    clearButton.addEventListener("click", clearSearch);
    document.addEventListener("DOMContentLoaded", function hideBrokenImg(){
        let firstLoadImg = document.querySelector('img');
        firstLoadImg.style.display = 'none'; //hide section where giphy is located on first load
    });
})();



async function fetchCurrentWeather(searchCity, searchState, searchCountry){
    try{
        const searchCity = document.getElementById("search-city").value;
        const searchState = document.getElementById("search-state").value;
        const searchCountry = document.getElementById("search-country").value;

        console.log(searchCity);
        console.log(searchState);
        console.log(searchCountry);

        //run fetch and wait for response
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "," + searchState + "," + searchCountry + "&units=imperial&APPID=38789a247ae58fa8b7c1d1e0cd566328", {mode: 'cors'})
        const currentData = await response.json();
        console.log("Fetching current data...", currentData);


        //create object that holds data 
        const currentWeather = {
            mainWeather: currentData.weather[0].main,
            place: currentData.name + ", " + searchState.toUpperCase() + " " + currentData.sys.country,
            temp: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity + "%",
            wind: Math.round(currentData.wind.speed) + "mph",
        }

        console.log(currentWeather);

        displayWeather(currentWeather);
        getGiphy(currentWeather.mainWeather);

        
    } catch(err){
        console.log(err);
    }
}

function clearSearch(){
    document.getElementById("search-city").value = "";
    document.getElementById("search-state").value = "";
    document.getElementById("search-country").value = "";
    const img = document.querySelector("img");
    img.style.display = "none";
    clearDOM();
}


//display JSON object to DOM
function displayWeather(currentWeather){
    const displayDiv = document.querySelector(".display-div");

    //clear any DOM elements from previous search
    clearDOM();

    //create DOM elements
    const city = document.createElement("p");
    city.textContent = currentWeather.place;
    displayDiv.append(city);
    const status = document.createElement("p");
    status.textContent = currentWeather.mainWeather;
    displayDiv.append(status);
    const cityTemp = document.createElement("p");
    cityTemp.textContent = currentWeather.temp + " Degrees";
    displayDiv.append(cityTemp);
    const cityHumidity = document.createElement("p");
    cityHumidity.textContent = currentWeather.humidity + " Humidity";
    displayDiv.append(cityHumidity);
    const cityWind = document.createElement("p");
    cityWind.textContent = currentWeather.wind + " wind";
    displayDiv.append(cityWind);
}

async function getGiphy(mainWeather){
    try {
        const img = document.querySelector("img");
        let keyWord = mainWeather;
        if(keyWord == "Clear"){
            keyWord = "Clear Sky";
        }
        const response = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=LJomEr4TrU2rIudo0GqBgaDWxgMBHiX1&s=' + keyWord, {mode: "cors"});
        const giphyResponse = await response.json();
        console.log(giphyResponse);
        img.style.display = ""; //changes from none to empty, revealing the img
        img.src = giphyResponse.data.images.original.url; 
    } catch (error) {
        console.log(err);
        
    }
}





function clearDOM(){
    //clear dom from previous search
    const nodeList = document.querySelectorAll("p");
    if (nodeList !== null){
        for(let i = 0; i < nodeList.length; i++){
            nodeList[i].remove();
        }
    }
}


