const cityInput = document.getElementById("city-input")
const weatherButton = document.querySelector(".upper-box-item")
const previousSearches = document.querySelector(".previous-searches")

weatherButton.addEventListener("click", () => {
    const cityName = cityInput.replace(/\s+/g, "+");
    const apiUrl = `https://wttr.in/${cityName}?format=j1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.current_condition[0].temp_C;
            const weatherBox = document.querySelector(".Weather-Box");
            weatherBox.textContent = `Current weather in ${data.request.query}: ${currentWeather}°C`;

            const previousSearchesList = previousSearches.querySelector("ul");
            const newSearch = document.createElement("li");
            newSearch.textContent = data.request.query;
            previousSearchesList.appendChild(newSearch);
        })
        .catch(error =>{
            console.error(error);
        });

});