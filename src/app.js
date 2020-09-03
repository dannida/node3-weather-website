const chalk = require('chalk')
const path = require('path')
const express = require('express')
const hsb = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { DefaultDeserializer } = require('v8')


// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

//express function is assigned to app
const app = express()

//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//tells express.js which templating engine u are using.... in this case, hbs
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hsb.registerPartials(partialsPath)

//.use method is used to customize the server in node.....express is pointed to the path of the root folder we are hosting on the server
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather man',
        name: 'dannida'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Akwesi Dannida'
    })
})

app.get('/help', (req, res) => {
        res.render('help', {
            title: 'Help page',
            faq: 'Scroll below to find frequently asked questions',
            clicks: 'how does it work',
            name: 'dannida'
        })
    })
    //the get method will process data to the browser

//access the app.com/Staff resource
app.get('/Weather', (req, res) => {
    const userLocation = req.query.address
    if (!userLocation)
        return res.send({
            error: 'Please provide an Address!!'
        })

    geocode(userLocation, (error, data = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location: data.location,
                address: userLocation
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Product not found'
        })
    }
    console.log(req.query.search)
    res.send({
        product: []
    })
})

app.get('/understand', (req, res) => {
    res.send(
        console.log("fool")
    )
})

//error handler for sub-page of /help that don't exist
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error Page',
        errorMessage: "Article don't exist... Try a related topic",
        name: 'dannida'
    })
})

//error handler for not finding a page... it must be the last app.get method to call
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error Page',
        errorMessage: 'Error 404... Page not found',
        name: 'dannida'
    })
})

//the listen method starts the server
app.listen(3000, () => {
    console.log(chalk.yellowBright('SERVER: "Valley of the dead souls" up and running on port 3000'))
})