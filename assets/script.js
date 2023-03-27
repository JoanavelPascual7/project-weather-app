const weatherBox = document.getElementById("Weather-box");
const cityInput = document.getElementById("city-input");
const previousSearches = document.querySelector(".previous-searches");

const getWeatherData = (cityName) => {
  const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

const updateWeatherBox = (json, cityName) => {
  weatherBox.innerHTML = "";

  const label = document.createElement("h3");
  label.textContent = cityName;
  weatherBox.append(label);

  const nearestArea = json.nearest_area[0].areaName[0].value;
  let areaLabel = "Area";
  
  if (!nearestArea.toLowerCase().includes(cityName.toLowerCase())) {
    areaLabel = "Nearest Area";
  }

  const area = document.createElement("li");
  area.innerHTML = `<strong>${areaLabel}:</strong> ${nearestArea}`;

  const regionName = json.nearest_area[0].region[0].value;
  const region = document.createElement("li");
  region.innerHTML = `<strong>Region:</strong> ${regionName}`;

  const countryName = json.nearest_area[0].country[0].value;
  const country = document.createElement("li");
  country.innerHTML = `<strong>Country:</strong> ${countryName}`;

  const temperatureValue = json.current_condition[0].FeelsLikeF;
  const temperature = document.createElement("li");
  temperature.innerHTML = `<strong>Currently:</strong> ${temperatureValue}°F`;

  const chanceOfSunshineValue = json.weather[0].hourly[0].chanceofsunshine;
  const chanceOfRainValue = json.weather[0].hourly[0].chanceofrain;
  const chanceOfSnowValue = json.weather[0].hourly[0].chanceofsnow;

  let iconUrl = "";
  let altText = "";

  if (chanceOfSunshineValue > 50) {
    iconUrl = "assets/icons8-summer.gif";
    altText = "sun";
  } else if (chanceOfRainValue > 50) {
    iconUrl = "assets/icons8-torrential-rain.gif";
    altText = "rain";
  } else if (chanceOfSnowValue > 50) {
    iconUrl = "assets/icons8-light-snow.gif";
    altText = "snow";
  }

  const icon = document.createElement("img");
  icon.src = iconUrl;
  icon.alt = altText;

  const ul = document.createElement("ul");
  ul.classList.add("no-bullet");
  ul.append(area, region, country, temperature, icon);

  weatherBox.append(ul);

  const previousSearch = document.createElement("li");
  previousSearch.textContent = cityName;
  previousSearches.append(previousSearch);
};

const handleSearch = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") {
    return;
  }
  getWeatherData(cityName)
    .then((json) => {
      updateWeatherBox(json, cityName);
      cityInput.value = "";
    })
    .catch((error) => console.error("Error:", error));
};

document.getElementById("search-button").addEventListener("click", handleSearch);
