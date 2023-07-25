import { timeToDep } from './tripCountdown'

async function tripInfo(event){

    event.preventDefault(); // stop the app from doing its thing

    let geoNamesData = {}; // hold the API data in a data object
    let pixabayData = {};
    let weatherbitData = {};
    let city = document.getElementById('city').value; // taking user data from the UI
    let tripDate = document.getElementById('depDate').value;

    console.log(`Retrieved from the UI: destination city: ${city}, departure date: ${tripDate}`);

    try {
        geonamesData = await getGeoData(city); 
        weatherbitData = await getWeatherData(geoNamesData); 
        pixabayData = await getPic(geoNamesData);
        tripCountdown = timeToDep(tripDate)

        updateUI(geoNamesData, weatherbitData, pixabayData, tripCountdown)
    } catch (error) {
        console.log('Error in translating the trip info into the UI: ', error);
        return;
    }
}

//getting geo data from local endpoint

async function getGeoData(city){
    return fetch(`/geo?city=${city}`)
    .then(response => response.json())
    .then(data => {
        console.log('GeoNames retrieved response: ', data);
        return data;
    })
    .catch(error => {
        console.log('Error retrieving data from getGeoData: ', error);
    })
}

//getting weather data from local endpoint

async function getWeatherData(lat, lng){
    return fetch(`/weather?lat=${lat}&lng=${lng}`)
    .then(response => response.json())
    .then(data => {
        console.log('Weatherbit retrieved response: ', data);
        return data;
    })
    .catch(error => {
        console.log('Error retrieving data from getWeatherData: ', error);
    })
}

//getting pixabay picture from local endpoint

async function getPic(geoNamesData){
    const city = geoNamesData.city;
    const country = geoNamesData.country;

    return fetch(`/pixabay?city=${city}&country=${country}`)
    .then(response => response.json())
    .then(data => {
        console.log('Pixabay retrieved response: ', data);
        return data;
    })
    .catch(error => {
        console.log('Error retrieving data from getPic: ', error);
    })
}

// Function to update the UI with trip information
function updateUI(geonamesData, weatherbitData, pixabayData, tripCountdown) {
    document.getElementById('tripCountdown').innerHTML = `You are departing on your trip in ${tripCountdown.timeinDays} days`
    document.getElementById('weatherInfo').innerHTML = `Weather in ${geonamesData.city},${genamesData.country} in the last 7 days: min. temperature: ${weatherbitData.min_temp}°C, max. temperature: ${weatherbitData.max_temp}°C, weather description: ${weatherbitData.weather_description}`;
    document.getElementById('picInfo').innerHTML = `<img src="${pixabayData.imageURL}" alt="City Image">`;
}

export { tripInfo, updateUI};