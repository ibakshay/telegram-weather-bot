require('dotenv').config()
const fetch = require('node-fetch')
const telegram = require('node-telegram-bot-api')
const bot = new telegram(process.env.TELEGRAM_TOKEN)

const weatherToken = process.env.WEATHER_API_TOKEN

function setUrl(cityName) {
    const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather')
    weatherURL.searchParams.set('q', cityName)
    weatherURL.searchParams.set('appid', weatherToken)
    weatherURL.searchParams.set('units', 'metric')
    return weatherURL;
}
function setUrl1(cityName) {
    const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather')
    weatherURL.searchParams.set('zip', cityName)
    weatherURL.searchParams.set('appid', weatherToken)
    weatherURL.searchParams.set('units', 'metric')
    return weatherURL;
}

// const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather')
// weatherURL.searchParams.set('q', 'Neyveli')
// weatherURL.searchParams.set('appid', weatherToken)
// weatherURL.searchParams.set('units', 'metric')

const getWeatherData = async () => {
    const neyveliWeatherURL = setUrl('Neyveli')
    const munichWeatherURL = setUrl('80939,de')
    const heidelbergWeatherURL = setUrl1('69115,de')
    const weatherResponse = await fetch(munichWeatherURL.toString())
    const body = await weatherResponse.json()
    let [neyveliWeather, heidelbergWeather, munichWeather] = await Promise.all([
        fetch(neyveliWeatherURL.toString()).then(response => response.json()),
        fetch(heidelbergWeatherURL.toString()).then(response => response.json()),
        fetch(munichWeatherURL.toString()).then(response => response.json()),
    ]);
    const weatherData = {
        neyveli: neyveliWeather,
        heidelberg: heidelbergWeather,
        munich: munichWeather,
    }
    console.log(` The weather data is ${ JSON.stringify(weatherData, null, 2) }`)
    return weatherData
}

function generateWeatherMessage(weatherData) {
    const neyveliMessage = `The weather in ${ weatherData.neyveli.name } : ${ weatherData.neyveli.weather[0].description }. Current temperature is 
    ${ weatherData.neyveli.main.temp } Celsius (feels like) ${ weatherData.neyveli.main.feels_like } Celsius, with a low temp of ${ weatherData.neyveli.main.temp_min } Celsius and high temp of ${ weatherData.neyveli.main.temp_max } Celsius. \n \n `
    const heidelbergMessage = `The weather in ${ weatherData.heidelberg.name } : ${ weatherData.heidelberg.weather[0].description }. Current temperature is  ${ weatherData.heidelberg.main.temp } Celsius (feels like) ${ weatherData.heidelberg.main.feels_like } Celsius, with a low temp of ${ weatherData.heidelberg.main.temp_min } Celsius and high temp of ${ weatherData.heidelberg.main.temp_max } Celsius. \n \n `
    const munichMessage = `The weather in ${ weatherData.munich.name } : ${ weatherData.munich.weather[0].description }. Current temperature is  ${ weatherData.munich.main.temp } Celsius (feels like) ${ weatherData.munich.main.feels_like } Celsius, with a low temp of ${ weatherData.munich.main.temp_min } Celsius and high temp of ${ weatherData.munich.main.temp_max } Celsius.`
    const message = neyveliMessage.concat(heidelbergMessage, munichMessage)
    return message

}
const main = async () => {
    const weatherData = await getWeatherData()
    const weatherMessage = generateWeatherMessage(weatherData)
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, weatherMessage)
    console.log(weatherMessage)
}

main()