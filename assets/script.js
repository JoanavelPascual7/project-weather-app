const weatherBox = document.querySelector(".Weather-box article");
const cityInput = document.getElementById("search");
const previousSearches = document.querySelector(".previous-searches ul");

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

  // Add handling for imperfect location matching
  const mismatch = json.nearest_area[0].areaName[0].matchLevel;
  if (mismatch && mismatch.toLowerCase() !== "exact") {
    const mismatchLabel = document.createElement("li");
    mismatchLabel.innerHTML = `<strong>Mismatch:</strong> ${mismatch}`;
    area.insertAdjacentElement("afterend", mismatchLabel);
  }

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

  const chanceOfSunshine = document.createElement("li");
  chanceOfSunshine.innerHTML = `<strong>Chance of Sunshine:</strong> ${chanceOfSunshineValue}%`;

  const chanceOfRain = document.createElement("li");
  chanceOfRain.innerHTML = `<strong>Chance of Rain:</strong> ${chanceOfRainValue}%`;

  const chanceOfSnow = document.createElement("li");
  chanceOfSnow.innerHTML = `<strong>Chance of Snow:</strong> ${chanceOfSnowValue}%`;

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
  ul.append(area, region, country, temperature, chanceOfSunshine, chanceOfRain, chanceOfSnow, icon);

  weatherBox.append(ul);

  const previousSearch = document.createElement("li");
  previousSearch.textContent = cityName;
  previousSearches.append(previousSearch);




  updateUpcomingWeather(json);
};

const updateUpcomingWeather = (json) => {
  const upcomingWeather = document.querySelector(".upcoming-weather");
  const todaySection = upcomingWeather.querySelector(".today");
  const tomorrowSection = upcomingWeather.querySelector(".tomorrow");
  const dayAfterTomorrowSection = upcomingWeather.querySelector(".day-after-tomorrow");

  // Today's weather data
  const currentTemperature = json.current_condition[0].FeelsLikeF;
  const todayMinTemperature = json.weather[0].mintempF;
  const todayMaxTemperature = json.weather[0].maxtempF;
  todaySection.innerHTML = `
    Today<br>
    Average Temperature: ${currentTemperature}°F<br>
    Min Temperature: ${todayMinTemperature}°F<br>
    Max Temperature: ${todayMaxTemperature}°F
  `;

  // Tomorrow's weather data
  const tomorrowTemperature = json.weather[1].avgtempF;
  const tomorrowMinTemperature = json.weather[1].mintempF;
  const tomorrowMaxTemperature = json.weather[1].maxtempF;
  tomorrowSection.innerHTML = `
    Tomorrow<br>
    Average Temperature: ${tomorrowTemperature}°F<br>
    Min Temperature: ${tomorrowMinTemperature}°F<br>
    Max Temperature: ${tomorrowMaxTemperature}°F
  `;

  // Day after tomorrow's weather data
  const dayAfterTomorrowTemperature = json.weather[2].avgtempF;
  const dayAfterTomorrowMinTemperature = json.weather[2].mintempF;
  const dayAfterTomorrowMaxTemperature = json.weather[2].maxtempF;
  dayAfterTomorrowSection.innerHTML = `
    Day After Tomorrow<br>
    Average Temperature: ${dayAfterTomorrowTemperature}°F<br>
    Min Temperature: ${dayAfterTomorrowMinTemperature}°F<br>
    Max Temperature: ${dayAfterTomorrowMaxTemperature}°F
  `;
};


const convertTemperature = (temperature, toCelsius) => {
  if (toCelsius) {
    return (temperature - 32) * 5 / 9;
  } else {
    return temperature * 9 / 5 + 32;
  }
};

const handleTemperatureConversion = (event) => {
  event.preventDefault();
  const temperatureInput = document.getElementById("temp-to-convert");
  const temperatureValue = temperatureInput.value;

  const toCelsiusRadio = document.getElementById("to-c");
  const toCelsius = toCelsiusRadio.checked;

  const convertedTemperature = convertTemperature(temperatureValue, toCelsius);
  const result = document.createElement("h4");
  result.textContent = `${temperatureValue}${toCelsius ? "°F" : "°C"} is ${convertedTemperature.toFixed(2)}${toCelsius ? "°C" : "°F"}`;

  weatherBox.appendChild(result);
};

const temperatureForm = document.createElement("form");
const temperatureLabel = document.createElement("label");
temperatureLabel.textContent = "Convert the temperature:";
temperatureForm.appendChild(temperatureLabel);

const temperatureInput = document.createElement("input");
temperatureInput.type = "number";
temperatureInput.id = "temp-to-convert";
temperatureForm.appendChild(temperatureInput);

const toCelsiusLabel = document.createElement("label");
toCelsiusLabel.textContent = "to C";
temperatureForm.appendChild(toCelsiusLabel);

const toCelsiusRadio = document.createElement("input");
toCelsiusRadio.type = "radio";
toCelsiusRadio.id = "to-c";
toCelsiusRadio.name = "convert-temp";
toCelsiusRadio.value = "c";
temperatureForm.appendChild(toCelsiusRadio);

const toFahrenheitLabel = document.createElement("label");
toFahrenheitLabel.textContent = "to F";
temperatureForm.appendChild(toFahrenheitLabel);

const toFahrenheitRadio = document.createElement("input");
toFahrenheitRadio.type = "radio";
toFahrenheitRadio.id = "to-f";
toFahrenheitRadio.name = "convert-temp";
toFahrenheitRadio.value = "f";
temperatureForm.appendChild(toFahrenheitRadio);

const submitButton = document.createElement("input");
submitButton.type = "submit";
temperatureForm.appendChild(submitButton);

temperatureForm.addEventListener("submit", handleTemperatureConversion);
weatherBox.appendChild(temperatureForm);




const handleSearch = (event) => {
  event.preventDefault();
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

document.querySelector("form").addEventListener("submit", handleSearch);