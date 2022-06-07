const Availability = require('../models/availability')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/disponibilidad', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const {carsLocation, listCars, carsTravel} = await Availability.list()
            res.render('availability', {
                carsLocation,
                carsTravel,
                listCars
            })
        } catch (err) {
            next(err)
        }
    })
}