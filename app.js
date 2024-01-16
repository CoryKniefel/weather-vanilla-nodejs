import * as api from "./weatherApi.js";

const hoodRiverZip = 97031;

api.getLatLonForCity(hoodRiverZip)
    .then(hrLatLon => {
        if (hrLatLon) {
            return api.getWeatherForLatLon(hrLatLon.lat, hrLatLon.lon);
        } else {
            throw new Error("Unable to retrieve lat/lon for hood river")
        }
    }).then(hrWeather => {
    console.log("Got the result: ");
    console.log(hrWeather);
})
    .catch(error => {
        console.error('An error occurred:', error.message);
    });

