const request = require('request')

if ( process.env.NODE_ENV === 'production') {
  var darkSkyToken = process.env.DARK_SKY_SECRET_KEY
  var mapBoxToken = process.env.MAPBOX_TOKEN
} else {
  const credentials = require('./credentials.js')
  var darkSkyToken = credentials.DARK_SKY_SECRET_KEY
  var mapBoxToken = credentials.MAPBOX_TOKEN
}

const mapBox = function(name, callback) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + name +
                '.json?access_token=' + mapBoxToken
    request({ url, json: true }, function(error, response) {
        if (error) {
            callback('Unable to connect to MapBox service', undefined)
        } else {
            const data = response.body
            if (data.message) {
                callback(data.message, undefined)
            } else {
                const info = {
                    name: data.features[0].place_name,
                    longitude: data.features[0].geometry.coordinates[0],
                    latitude: data.features[0].geometry.coordinates[1]
                }
                callback(undefined, info)
            }
        }
    })
}

const darkSky = function(place, latitude, longitude, callback) {
    const url = 'https://api.darksky.net/forecast/' + darkSkyToken + '/' +
                 latitude + ',' + longitude + '?units=si'
    request({ url, json: true }, function(error, response) {
        if (error) {
            callback('Unable to connect to DarkSky service', undefined)
        } else {
            var data = response.body
            if (data.error) {
                callback(data.error, undefined)
            } else {
                const summary = data.hourly.summary
                const temperature = data.currently.temperature
                const rain = data.currently.precipProbability
                data = 'Today in ' + place + ': ' + summary + ' Expected temperature of ' + temperature + '°C and ' +
                rain + '% probability of rain.'
                console.log(data)
                const info = {
                  location: place,
                  weather: summary,
                  temperature: temperature,
                  rain_probability: rain
                }
                callback(undefined, info)
            }
        }
    })
}

module.exports = {
  mapBox : mapBox,
  darkSky : darkSky
}
