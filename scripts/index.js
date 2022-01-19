// InSight's weather API Documentation: https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const togglePrevWeatherArrow = document.querySelector(".previous-weather-hide-arrow");
const prevWeatherSection = document.querySelector(".previous-weather-section");

const mainSolElement = document.querySelector("[data-current-sol]");
const mainDateElement = document.querySelector("[data-current-date]");
const mainTempHighElement = document.querySelector("[data-current-temp-high]");
const mainTempLowElement = document.querySelector("[data-current-temp-low]");
const mainWindSpeedElement = document.querySelector("[data-wind-speed]");

const previousSolContainer = document.querySelector("[data-previous-week]");
const previousSolTemplate = document.querySelector("[data-previous-week-template]");

const unitToggleBtn = document.querySelector("[unit-toggle]");
const celciusRadio = document.getElementById("celcius");
const fahrenheitRadio = document.getElementById("fahrenheit");

togglePrevWeatherArrow.addEventListener("click", () => {
    prevWeatherSection.classList.toggle("show-weather");
});

unitToggleBtn.addEventListener("click", () => { 
    let inMetricUnits = !isMetric();
    celciusRadio.checked = inMetricUnits;
    fahrenheitRadio.checked = !inMetricUnits;
    updateTemperatureUnits();
    heroDisplaySelectedSol();
    displayPreviousWeek();
});



// ****** Main Application Logic ****** 
let latestSolIndex;

getWeatherData().then(sols => {
    latestSolIndex = sols.length - 1; 
    heroDisplaySelectedSol(sols);
    displayPreviousWeek(sols);
    updateTemperatureUnits();
}).catch(error => {
    console.error(error);
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
        });
}

function heroDisplaySelectedSol(sols){
    const selectedSol = sols[latestSolIndex];
    mainSolElement.innerText = selectedSol.sol;
    mainDateElement.innerText = displayDate(selectedSol.date);
    mainTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
    mainTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
    mainWindSpeedElement.innerText = displayWindSpeed(selectedSol.windSpeed);
}

function displayPreviousWeek(sols){
    previousSolContainer.innerHTML = ''; 
    sols.forEach((currentSol, index) => {
        const solContainer = previousSolTemplate.textContent.cloneNode(true);
        solContainer.querySelector("[data-sol]").innerText = currentSol.sol;
        solContainer.querySelector("[data-date]").innerText = displayDate(currentSol.date);
        solContainer.querySelector("[data-temp-high]").innerText = displayTemperature(currentSol.maxTemp);
        solContainer.querySelector("[data-temp-low]").innerText = displayTemperature(currentSol.min);
        solContainer.querySelector("[data-more-button]").addEventListener("click", () => {
            latestSolIndex = index;
            heroDisplaySelectedSol(sols);
        });
        
        previousSolContainer.appendChild(solContainer);
    });
}

function displayDate(date){
    return date.toLocalDateString(
        undefined,
        {day: "numeric", month: "long"}
    )
}

function displayTemperature(temperature){ // Celcius --> Farenheight
    let returnTemp = temperature;
    if (!isMetric()) {
        returnTemp = (temperature - 32) * (5 / 9);
    }
    return Math.round(returnTemp);
}

function displayWindSpeed(speed){
    let returnSpeed = speed;
    if (!isMetric()) {
        returnSpeed = speed / 1.609;
    }
    return Math.round(returnSpeed);
}

function updateTemperatureUnits(){
    const speedUnits = document.querySelectorAll("[data-speed-unit]");
    const tempUnits = document.querySelectorAll("[data-temp-unit]");

    speedUnits.forEach(el => {
        if(isMetric()){
            el.innerText = "kph";            
        } else {
            el.innerText = "mph";
        }
    });

    tempUnits.forEach(el => {
        if(isMetric()){
            el.innerText = "C";            
        } else {
            el.innerText = "F";
        }
    });
}

function isMetric(){
    return celciusRadio.checked;
}