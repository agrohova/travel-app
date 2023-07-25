import { timeToDep } from './tripCountdown'

async function tripInfo(event){

    event.preventDefault(); // stop the app from doing its thing

    let geonamesData = {}; // hold the API data in a data object
    let pixabayData = {};
    let weatherbitData = {};
    let timeInDays = '';
    let city = document.getElementById('destCity').value; // taking user data from the UI
    let tripDate = document.getElementById('depDate').value;

    console.log(`Retrieved from the UI: destination city: ${city}, departure date: ${tripDate}`);

    try {
        geonamesData = await getGeoData(city); 
        weatherbitData = await getWeatherData(geonamesData.lat, geonamesData.lng); 
        pixabayData = await getPic(geonamesData);
        tripCountdown = timeToDep(tripDate)

        updateUI(geonamesData, weatherbitData, pixabayData, timeInDays)
    } catch (error) {
        console.log('Error in translating the trip info into the UI: ', error);
        return;
    }
}

//getting geo data from local endpoint
async function getGeoData(city) {
    try {
        const response = await fetch(`http://localhost:4000/geo?city=${city}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': "application/json" },
        });
        const data = await response.json();

        // Check if the response contains valid data
        if (data && data.lat !== undefined && data.lng !== undefined) {
            console.log('Geonames retrieved response: ', data);
            
           // Call the getWeatherData function with lat and lng parameters
           const weatherbitData = await getWeatherData(data.lat, data.lng);
           console.log('Weather data:', weatherbitData);
           return weatherbitData;
       } else {
           console.log('Error retrieving data from getGeoData: Invalid response');
           return null;
       }
   } catch (error) {
       console.log('Error retrieving data from getGeoData: ', error);
       return null;
   }
}

//getting weather data from local endpoint

async function getWeatherData(geonamesData) {
    try {
        const lat = geonamesData.lat;
        const lng = geonamesData.lng;
        const response = await fetch(`http://localhost:4000/weather?lat=${lat}&lng=${lng}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            // Handle non-2xx status codes (e.g., 404, 500)
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log('Weatherbit retrieved response:', data);
        return data;
    } catch (error) {
        console.log('Error retrieving data from getWeatherData:', error);
        throw error;
    }
}

//getting pixabay picture from local endpoint

async function getPic(geonamesData) {
    try {
        const city = geonamesData.city;
        const country = geonamesData.country;

        const response = await fetch(`http://localhost:4000/pixabay?city=${city}&country=${country}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            // Handle non-2xx status codes (e.g., 404, 500)
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log('Pixabay retrieved response:', data);
        return data;
    } catch (error) {
        console.log('Error retrieving data from getPic:', error);
        throw error;
    }
}

// Function to update the UI with trip information
function updateUI(geonamesData, weatherbitData, pixabayData, timeInDays) {
    document.getElementById('tripCountdown').innerHTML = `You are departing on your trip in ${timeInDays} days`
    document.getElementById('weatherInfo').innerHTML = `Weather in ${geonamesData.city},${geonamesData.country} in the last 7 days: min. temperature: ${weatherbitData.min_temp}°C, max. temperature: ${weatherbitData.max_temp}°C, weather description: ${weatherbitData.weather_description}`;
    document.getElementById('picInfo').innerHTML = `<img src="${pixabayData.imageURL}" alt="City Image">`;
}

export { tripInfo, updateUI};