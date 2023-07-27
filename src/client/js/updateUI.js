async function tripInfo(event){

    event.preventDefault(); // stop the app from doing its thing

    let timeInDays = timeToDep(tripDate);
    let city = document.getElementById('destCity').value; // taking user data from the UI
    let tripDate = document.getElementById('depDate').value;
    let pixabayData = {}

    console.log(`Retrieved from the UI: destination city: ${city}, departure date: ${tripDate}`);

    try {
        const { geonamesData, weatherData } = await getGeoData(city); 
        console.log('Geonames data:', geonamesData);
        console.log('Weather data:', weatherData);

        pixabayData = await getPic(geonamesData.city, geonamesData.country);
        console.log('Pixabay data:', pixabayData);

        timeInDays = timeToDep(tripDate);

        updateUI(geonamesData, weatherData, pixabayData, timeInDays)
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
            
           // Call the getWeatherData function with lat and lng parameters
           const weatherbitData = await getWeatherData(data.lat, data.lng);
           console.log('Weather data:', weatherbitData);
           return { geonamesData: data, weatherData: weatherbitData };
           
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

async function getWeatherData(lat, lng) {
    try {
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

        return {
            min_temp: data.data[0].min_temp,
            max_temp: data.data[0].max_temp,
            weather_description: data.data[0].weather.description,
        };

    } catch (error) {
        console.log('Error retrieving data from getWeatherData:', error);
        throw error;
    }
}

//getting pixabay picture from local endpoint

async function getPic(city, country) {
    try {
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

        return data;
    } catch (error) {
        console.log('Error retrieving data from getPic:', error);
        throw error;
    }
}
// function to obtain today's date
function todaysDate() {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1; //January is 0, so we add +1 to match the normal calendar order
    let year = now.getFullYear();

    let today = day + "/" + month + "/" + year;

    return today //this says what day is it today
}
console.log('today is ' + todaysDate());

//function to obtain time to departure

function timeToDep(tripDate) {
    let dateFuture = new Date(tripDate);
    let todayDate = new Date();
    let dateDiff = dateFuture - todayDate;
    let timeInDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24)); //time is in milliseconds, so therefore the math

    return timeInDays //this says how many days do we have left till the departure
}

document.getElementById("save-btn").addEventListener("click", function() {
    let tripDate = document.getElementById("depDate").value;
    console.log("You are departing on your trip on " + tripDate);
    console.log("You are departing on your trip in " + timeToDep(tripDate) + " days!");
});

// Function to update the UI with trip information
function updateUI(geonamesData, weatherData, pixabayData, timeInDays) {
    document.getElementById('tripCountdown').innerHTML = `You are departing to ${geonamesData.city} in ${timeInDays} days`
    document.getElementById('weatherInfo').innerHTML = `Weather in ${geonamesData.city}, ${geonamesData.country} might be like this: `;
    
    const weatherInfoList = document.getElementById('weatherDetails');
    weatherInfoList.innerHTML = ''; // Clear previous content

    // Create list items for weather data
    const weatherListItems = [
        `Min. Temperature: ${weatherData.min_temp}°C`,
        `Max. Temperature: ${weatherData.max_temp}°C`,
        `Weather Description: ${weatherData.weather_description}`
    ];

    // Append list items to the unordered list
    weatherListItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        weatherInfoList.appendChild(li);
    });
    
    document.getElementById('picInfo').innerHTML = `<img src="${pixabayData.imageURL}" alt="City Image">`;
}

document.getElementById('remove-btn').addEventListener('click', function () {

    const elementsToEmpty = [
      'tripCountdown',
      'cityInfo',
      'weatherInfo',
      'weatherDetails',
      'picInfo'
    ];
  
    // for each element, empty the inner HTML
    elementsToEmpty.forEach(elementId => {
      const element = document.getElementById(elementId);
      element.innerHTML = '';
    });
});


export { tripInfo, updateUI, timeToDep };