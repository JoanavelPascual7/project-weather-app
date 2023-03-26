const weatherBox = document.getElementById("Weather-box");
const cityInput = document.getElementById("city-input");
const previousSearches = document.querySelector(".previous-searches");

const getWeatherData = (cityName) => {
  let url = `https://wttr.in/${cityName.replace(" ", "+")}?format=j1`;
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const updateWeatherBox = (json, cityName) => {
  weatherBox.innerHTML = "";

  let label = document.createElement("h3");
  label.textContent = cityName;
  weatherBox.append(label);

  let areaName = json.nearest_area[0].areaName[0].value;
  let area = document.createElement("li");
  area.innerHTML = `<strong>Area:</strong> ${areaName}`;
  weatherBox.append(area);

  let regionName = json.nearest_area[0].region[0].value;
  let region = document.createElement("li");
  region.innerHTML = `<strong>Region:</strong> ${regionName}`;
  weatherBox.append(region);

  let countryName = json.nearest_area[0].country[0].value;
  let country = document.createElement("li");
  country.innerHTML = `<strong>Country:</strong> ${countryName}`;
  weatherBox.append(country);

  let temperatureValue = json.current_condition[0].FeelsLikeF;
  let temperature = document.createElement("li");
  temperature.innerHTML = `<strong>Currently:</strong> ${temperatureValue}°F`;
  weatherBox.append(temperature);
};

const handleSearch = () => {
  let cityName = cityInput.value.trim();
  if (cityName === "") {
    return;
  }
  getWeatherData(cityName)
    .then((json) => {
      updateWeatherBox(json, cityName);
      
      let searchItem = document.createElement("li");
      searchItem.textContent = cityName;
      previousSearches.removeChild(previousSearches.lastElementChild);
      previousSearches.prepend(searchItem);
    })
    .catch((error) => {
      console.error("Error:", error);
      weatherBox.textContent = `Unable to get weather data for ${cityName}.`;
    });
};

document.querySelector(".upper-box button").addEventListener("click", handleSearch);
