import * as http from "http";
import * as https from "https";

const key = process.env.apiKey

export const getLatLonForCity = (zipCode) => {
    return new Promise((resolve, reject) => {
        let lat;
        let lon;
        let result = {lat, lon}

        http.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${key}`,
            (res) => {
                const {statusCode} = res;
                const contentType = res.headers['content-type'];
                let error;

                if (statusCode !== 200) {
                    error = new Error('Request failed for getLatLonForCity. ' + `Status Code: ${statusCode}`)
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`)
                }

                if (error) {
                    console.log(error.message);
                    res.resume();
                    return reject(error);
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        result.lat = parsedData.lat;
                        result.lon = parsedData.lon;
                        resolve(result);
                    } catch (e) {
                        console.error(e.message);
                    }
                });

            }
        ).on('error', (e) => {
            console.error(e.message)

        });

    });

}

export const getWeatherForLatLon = (lat, lon) => {
    return new Promise((resolve, reject) => {
        let result;

        https.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`,
            (res) => {
                const {statusCode} = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed for getWeatherForLatLon.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error(error.message);
                    // Consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        result = JSON.parse(rawData);
                        resolve(result);
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

    });

}
