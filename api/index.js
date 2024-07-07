require("dotenv").config();

const Express = require("express");
const app = Express();

const axios = require('axios');
const cors = require("cors");
const Port = 3000;

app.use(cors());



const IPINFO_API_KEY = process.env.IPIN_INFO_TOKEN;
const OPENWEATHER_API_KEY = process.env.WEATHER_KEY;

app.get('/api/location-weather', async (req, res) => {
    const {name} = req.query;
    try {
        // Get IP address
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`Detected IP address: ${ip}`);

        // Get location details using IP
        const ipInfoUrl = `https://ipinfo.io/${ip}?token=${IPINFO_API_KEY}`;
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const { city, region, country, loc } = ipInfoResponse.data;
        
        if (!loc) {
            throw new Error('Location data not found');
        }

        const coordinates = loc.split(',');
        if (coordinates.length !== 2) {
            throw new Error('Invalid location format');
        }

        // Get weather details using location coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        // Construct response
        const response = {
            ip,
            location: {
                city,
                region,
                country,
                coordinates: {
                    latitude: lat,
                    longitude: lon,
                },
            },
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching location or weather data:', error);
        res.status(500).json({ error: 'Failed to fetch location or weather data' });
    }
});

module.export = app;
