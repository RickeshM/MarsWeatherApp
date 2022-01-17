// CSS show/hide previous weather section
const togglePrevWeatherArrow = document.querySelector(".previous-weather-hide-arrow");
const prevWeatherSection = document.querySelector(".previous-weather-section");

togglePrevWeatherArrow.addEventListener("click", () => {
    prevWeatherSection.classList.toggle("show-weather");
});

// InSight's weather API Documentation: https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

getWeatherData();

function getWeatherData(){ // query's the API by fetching data
    fetch(API_URL)
        .then(res => res.json())
        .then(data => { // destructuring data into variables we can use
            const { sol_keys, validity_checks, ...solData } = data;
            
            Object.entries(solData).map(([sol, data]) => { //grab the sol number and all objects inside it
                return {
                    sol: sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    date: new Date(data.first_UTC)
                }
            });
        })
}
