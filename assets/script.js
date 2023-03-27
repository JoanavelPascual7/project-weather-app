const weatherBox = document.getElementById("Weather-box");
const cityInput = document.getElementById("city-input");
const previousSearches = document.querySelector(".previous-searches");

const getWeatherData = (cityName) => {
  let url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1`;
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

  let regionName = json.nearest_area[0].region[0].value;
  let region = document.createElement("li");
  region.innerHTML = `<strong>Region:</strong> ${regionName}`;

  let countryName = json.nearest_area[0].country[0].value;
  let country = document.createElement("li");
  country.innerHTML = `<strong>Country:</strong> ${countryName}`;

  let temperatureValue = json.current_condition[0].FeelsLikeF;
  let temperature = document.createElement("li");
  temperature.innerHTML = `<strong>Currently:</strong> ${temperatureValue}°F`;

  let ul = document.createElement("ul");
  ul.classList.add("no-bullet");
  ul.append(area, region, country, temperature);

  weatherBox.append(ul);

  let previousSearch = document.createElement("li");
  previousSearch.textContent = cityName;
  previousSearches.append(previousSearch);
};

const handleSearch = () => {
  let cityName = cityInput.value.trim();
  if (cityName === "") {
    return;
  }
  getWeatherData(cityName)
    .then((json) => {
      updateWeatherBox(json, cityName);
      cityInput.value = "";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

document.querySelector("button").addEventListener("click", handleSearch);
