// show/hide previous weather section
const togglePrevWeather = document.querySelector(".previous-weather-hide-arrow");
const prevWeatherSection = document.querySelector(".previous-weather-section");
togglePrevWeather.addEventListener("click", () => {
    prevWeatherSection.classList.toggle("show-weather");
});

// InSight's weather API Documentation: https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
