const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const weatherURL = 'http://api.weatherstack.com/current?access_key=eeddfddb6b35c8aa595c72be8b8bc90b&query=' + latitude + ',' + longitude + '&units=f'
    request({ url: weatherURL, json: true }, (error, response) => {

        const tmp = response.body.current.temperature
        const prec = response.body.current.precip
        const weatherDescrip = response.body.current.weather_descriptions

        if (error) {
            callback('Unable to connect to weather service! Check your Internet Connectivity', undefined)
        } else if (response.body.error) {
            callback('Unable to find Location', undefined)
        } else {
            callback(undefined, weatherDescrip + '. It is currently ' + tmp + ' degrees out there. ' + 'There is ' + prec + '% chance of rain')
        }
    })
}

module.exports = forecast