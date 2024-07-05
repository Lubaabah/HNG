require("dotenv").config();

const Express = require("express");
const app = Express();
const cors = require("cors");
const Port = 3000;


const { OpenWeatherAPI } = require("openweather-api-node");
const IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");

let weather = new OpenWeatherAPI({ key: process.env.WEATHER_KEY});
const ipGeolocationAPI = new IPGeolocationAPI(process.env.GEOLOCATION_KEY);

app.use(cors());

function handleResponse(json){
    return json
};


const GeolocationParams = require("ip-geolocation-api-javascript-sdk/GeolocationParams");


app.get("/api/hello", (req,res) => {
    const {name} = req.query;
    const geolocationParams = new GeolocationParams();
    geolocationParams.setExcludes("continent_name,connection_type,longitude,country_emoji,organization,currency,country_code3,time_zone,continent_code,country_code2,country_name,country_name_official,country_capital,state_prov,state_code,district,zipcode,latitude,is_eu,calling_code,country_tld,languages,country_flag,geoname_id,isp");
    const location = ipGeolocationAPI.getGeolocation(handleResponse, geolocationParams);

    ipGeolocationAPI.getGeolocation((response) => {
        const ip = response.ip;
        const city = response.city;

        weather.setLocationByName(city);

        weather.getCurrent().then(data => {
            const output = {
                "client_ip": ip,
                "location": city,
                "greeting": `Hello, ${name}! The temperature in ${city} is ${data.weather.temp.cur}\u00B0F.`
            };

            res.send(output);
        });
    }, geolocationParams);
    });
module.exports = app;
