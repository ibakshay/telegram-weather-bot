require('dotenv').config()
const fetch = require('node-fetch')
const telegram = require('node-telegram-bot-api')
const bot = new telegram(process.env.TELEGRAM_TOKEN)

const weatherToken = process.env.WEATHER_API_TOKEN

const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather')
weatherURL.searchParams.set('q', 'Heidelberg')
weatherURL.searchParams.set('appid', weatherToken)
weatherURL.searchParams.set('units', 'metric')

const getWeatherData = async () => {
    const weatherResponse = await fetch(weatherURL.toString())
    const body = await weatherResponse.json()
    return body
}

function generateWeatherMessage(weatherData) {
    const message = `The weather in ${ weatherData.name } : ${ weatherData.weather[0].description }. Current temperature is 
    ${ weatherData.main.temp } Celsius , with a low temp of ${ weatherData.main.temp_min } Celsius and high temp of ${ weatherData.main.temp_max } Celsius `
    return message

}
const main = async () => {
    const weatherData = await getWeatherData()
    const weatherMessage = generateWeatherMessage(weatherData)
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, weatherMessage)
    console.log(weatherMessage)
}

main()