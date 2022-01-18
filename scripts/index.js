// InSight's weather API Documentation: https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

// CSS show/hide previous weather section
const togglePrevWeatherArrow = document.querySelector(".previous-weather-hide-arrow");
const prevWeatherSection = document.querySelector(".previous-weather-section");

const mainSolElement = document.querySelector("[data-current-sol]");
const mainDateElement = document.querySelector("[data-current-date]");
const mainTempHighElement = document.querySelector("[data-current-temp-high]");
const mainTempLowElement = document.querySelector("[data-current-temp-low]");
const mainWindSpeedElement = document.querySelector("[data-wind-speed]");

togglePrevWeatherArrow.addEventListener("click", () => {
    prevWeatherSection.classList.toggle("show-weather");
});


let selectedSolIndex;
getWeatherData().then(sols => {
    selectedSolIndex = sols.length - 1; //latest sol 
    displaySelectedSol(sols);
});

// query's the API by fetching data and returning an array of sols
function getWeatherData(){ 
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => { // destructuring data into variables we can use
            const { sol_keys, validity_checks, ...solData } = data;
            
            return Object.entries(solData).map(([sol, data]) => { //what to grab from each object
                return {
                    sol: sol,
                    date: new Date(data.first_UTC),
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av
                }
            });
        })
}

function displaySelectedSol(sols){
    const selectedSol = sols[selectedSolIndex];
    mainSolElement.innerText = selectedSol.sol;
    mainDateElement.innerText = displayDate(selectedSol.date);
    mainTempHighElement.innerText = displayTemperature(selectedSol.AT.mx);
    mainTempLowElement.innerText = displayTemperature(selectedSol.AT.mn);
    mainWindSpeedElement.innerText = displayWindSpeed(selectedSol.HWS.av);
}

function displayDate(date){
    return date.toLocalDateString(
        undefined,
        {day: "numeric", month: "long"}
    )
}

function displayTemperature(temperature){
    return Math.round(temperature);
}

function displayWindSpeed(speed){
    return Math.round(speed);
}