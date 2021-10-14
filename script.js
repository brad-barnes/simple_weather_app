"use strict";

// Constants for DOM
const city = document.getElementById("cityName");
const state = document.getElementById("stateName");
const country = document.getElementById("countryName");
const temp = document.getElementById("currentTemp");
const wind = document.getElementById("currentWind");
const conditions = document.getElementById("currentConditions");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const btn = document.getElementById("zipBtn");
const zipcode = document.getElementById("zipcode");
const error = document.getElementById("errorMessage");
const heading = document.getElementById("heading");

// function to convert Kelvin temps to Fahrenheit
const kelvinToFahr = (temp) => {
  return ((temp - 273.15) * 1.8 + 32).toFixed();
};

// function to convert Unix Timecodes to Timecodes used by JavaScript Date()
const unixToJSTime = (unix) => {
  return unix * 1000;
};

// function to Display time for Sunrise and Sunset
const displayTime = (unix) => {
  const timeCode = unixToJSTime(unix);
  const date = new Date(timeCode);
  let hours;
  let min = date.getMinutes();
  let suffix = "PM";

  if (date.getHours() === 0) {
    hours = 12;
    suffix = "AM";
  } else if (date.getHours() < 12) {
    hours = date.getHours();
    suffix = "AM";
  } else if (date.getHours() === 12) {
    hours = date.getHours();
    suffix = "PM";
  } else {
    hours = date.getHours() - 12;
    suffix = "PM";
  }

  if (min === 0) {
    min = "00";
  } else if (min < 10) {
    min = "0" + min;
  }

  return `${hours}:${min} ${suffix}`;
};

// Function to capitalize the first word of a sentence - used for weather description
const capitalizeFirstLetter = (text) => {
  let splitText = text.split(" ");
  let firstWord = splitText[0];
  splitText.shift();
  firstWord =
    firstWord[0].toUpperCase() + firstWord.substr(1, firstWord.length);
  let capitizedText = [firstWord, ...splitText];
  return capitizedText.join(" ");
};

// function to fetch OpenWeatherMap API for current weather and populate HTML
const getWeather = async (zip = 75201) => {
  try {
    const zip = zipcode.value;

    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=3524d14183f1e4f524309ee84cce6e9c`
    );

    const data = await weather.json();

    const stateFromZip = await fetch(`http://ZiptasticAPI.com/${zip}`);
    const stateData = await stateFromZip.json();

    if (!weather.ok) {
      error.innerHTML = `Enter a VALID zipcode!`;
    } else {
      error.innerHTML = ``;
      city.value = `${data.name}`;
      state.value = `${stateData.state}`;
      country.value = `${stateData.country}`;
    }

    temp.value = `${kelvinToFahr(data.main.temp)}° F`;
    wind.value = `${data.wind.speed.toFixed()} MPH`;

    if (data.wind.gust.toFixed() > data.wind.speed.toFixed()) {
      wind.value = `${data.wind.speed.toFixed()} MPH / GUSTS: ${data.wind.gust.toFixed()} MPH`;
    } else {
      wind.value = `${data.wind.speed.toFixed()} MPH`;
    }
    conditions.value = `${capitalizeFirstLetter(data.weather[0].description)}`;

    sunrise.value = displayTime(data.sys.sunrise);
    sunset.value = displayTime(data.sys.sunset);
  } catch (err) {
    console.error(err.message);
  }
};

// Event listener for the button to click once a zip code has been entered
btn.addEventListener("click", getWeather);

zipcode.addEventListener("keyup", function (e) {
  e.preventDefault();
  if (e.keyCode === 13) {
    console.log("Enter entered!");
    btn.click(getWeather);
  }
});
// "Iffy" anonymous function that initially calls the getWeather function with the default zipcode
(function () {
  getWeather();
})();
