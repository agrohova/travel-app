const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

//modules
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

//app
const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../../dist")));

// designates what port the app will listen to for incoming requests
const server = app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
});

//define HTTP GET route

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

// Geonames API
const userName1 = process.env.USER_NAME1;
const baseURL1 = "http://api.geonames.org/searchJSON?";

app.get('/geo', getGeoData);

async function getGeoData(req, res){
    try {
        const city = req.query.city; // we get the city from the request object
        console.log('You are travelling to: ', city);
        const result = await getGeoNamesData(city);
        console.log('Geonames API response: ', result);
        res.setHeader('Accept', 'application/json');

        res.send(result);
        
    } catch (error) {
        console.log('Geonames API error: ', error);
        res.send(error);
    }
}

async function getGeoNamesData(city){
    const geoNamesURL = `${baseURL1}q=${city}&maxRows=1&username=${userName1}`;
    try {
        const response = await fetch(encodeURI(geoNamesURL));
        const data = await response.json();
        if(data.geonames.length > 0){ //checking that API response is not empty
            return { //geo data inside an object
                lat: data.geonames[0].lat,
                lng: data.geonames[0].lng,
                city: data.geonames[0].name,
                country: data.geonames[0].countryName
            };
        }
        return {};
    } catch (error) {
        console.log('Geonames API response error: ', error);
        throw error;
    }
}

// Weatherbit API
const apiKey2 = process.env.API_KEY2;
const baseURL2 = "https://api.weatherbit.io/v2.0/forecast/daily?";

app.get('/weather', getWeatherData);

async function getWeatherData(req, res) {
    try {
        const { lat, lng } = req.query; // Extract lat and lng from the request query
        console.log(`Following geo data are being passed to Weatherbit: Lat: ${lat}, Lng: ${lng}`);

        const result = await getWeatherbitData(lat, lng); // Pass lat and lng to getWeatherbitData
        console.log('Weatherbit API response:', result);

        res.send(result);
    } catch (error) {
        console.log('Error in getWeatherData:', error);
        res.send(error);
    }
}

async function getWeatherbitData(lat, lng) {
    const weatherbitURL = `${baseURL2}lat=${lat}&lon=${lng}&key=${apiKey2}`;
    try {
        const response = await fetch(encodeURI(weatherbitURL));
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Weatherbit API response error:', error);
        throw error;
    }
}

// Pixabay API
const apiKey3 = process.env.API_KEY3;
const baseURL3 = "https://pixabay.com/api/?";

app.get('/pixabay', getPic);

async function getPic(req, res){
    try {
        const city = req.query.city;
        const country = req.query.country;
        console.log(`Pixabay API request for : city ${city}, country: ${country}`);

        const result = await getPixabayData(city, country);
        console.log('Pixabay API response: ', result);

        res.send(result);

    } catch (error) {
        console.log('Pixabay API response error: ', error);
        res.send(error);
    }
}

async function getPixabayData(city, country){

    const pixabayURL = `${baseURL3}key=${apiKey3}&q=${city}&image_type=photo`;     // URL for destination city
    const pixabayURL2 = `${baseURL3}key=${apiKey3}&q=${country}&image_type=photo`; //URL for destination country, if city is too obscure

    try {
        const response = await fetch(pixabayURL);
        const data = await response.json();
        if(data.hits.length > 0){ // This happens when we get a normal city response
            return {
                imageURL: data.hits[0].webformatURL
            };
        }
        if(data.hits.length === 0){ // If there's no response for the city, we're accessing URL2 for country
            const response2 = await fetch(pixabayURL2);
            const data2 = await response2.json();
            return {
                imageURL: data2.hits[0].webformatURL
            };
        }
    } catch (error) {
        console.log('Error retrieving Pixabay image: ', error);
        throw error;
    }
}

//exports

module.exports = { app, server };