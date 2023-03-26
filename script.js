const cityName = prompt("Enter the name of the city")
cityName = cityName.replace(/\s+/g, '+');
const apiUrl = `https://wttr.in/${cityName}?format=j1`