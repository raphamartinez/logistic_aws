const Car = require('../models/car')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/cars/:date', [Middleware.bearer, Authorization('car', 'read')], async ( req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`car`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const cars = await Car.list(req.params.date)
            cachelist.addCache(`car`, JSON.stringify(cars), 60 * 60 * 2)

            res.json(cars)
        } catch (err) {
            next(err)
        }
    })

    app.get('/carstatus', [Middleware.bearer, Authorization('car', 'read')], async ( req, res, next) => {
        try {
            const cars = await Car.liststatus()
            res.json(cars)
        } catch (err) {
            next(err)
        }
    })

    app.put('/car/:plate', [Middleware.bearer, Authorization('car', 'update')], async ( req, res, next) => {
        try {

            await Car.update(req.params.plate, req.body.status)

            res.json({msg: `Camion actualizado con éxito.`})
        } catch (err) {
            next(err)
        }
    })


    app.get('/dashboard', [Middleware.bearer, Authorization('car', 'read')], async ( req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`dashboard`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const cars = await Car.dashboard()
            cachelist.addCache(`dashboard`, JSON.stringify(cars), 60 * 60 * 2)

            res.json(cars)
        } catch (err) {
            next(err)
        }
    })
}