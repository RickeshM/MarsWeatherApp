const togglePrevWeather = document.querySelector(".previous-weather-hide-arrow");

const prevWeatherSection = document.querySelector(".previous-weather-section");

togglePrevWeather.addEventListener("click", () => {
    prevWeatherSection.classList.toggle("show-weather");
});