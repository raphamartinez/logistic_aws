const Car = require('../models/car')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/vehiculos', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('vehiculos')
        } catch (err) {
            next(err)
        }
    })

    app.post('/car', [Middleware.authenticatedMiddleware, Authorization('car', 'create')], async (req, res, next) => {
        try {
            const car = req.body.car

            const id = await Car.insert(car)

            res.json({ msg: `Camion agregado con éxito.`, id })
        } catch (err) {
            next(err)
        }
    })


    app.get('/cars/:date', [Middleware.authenticatedMiddleware, Authorization('car', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`car`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }
            let cars
            if (req.access.all.allowed) {
                cars = await Car.list(req.params.date)
            } else {
                cars = await Car.list(req.params.date, req.login.places)
            }

            // cachelist.addCache(`car`, JSON.stringify(cars), 60 * 60 * 2)

            res.json(cars)
        } catch (err) {
            next(err)
        }
    })

    app.get('/carstatus', [Middleware.authenticatedMiddleware, Authorization('car', 'read')], async (req, res, next) => {
        try {
            const cars = await Car.liststatus()
            res.json(cars)
        } catch (err) {
            next(err)
        }
    })

    app.put('/car/edit/:id', [Middleware.authenticatedMiddleware, Authorization('car', 'update')], async (req, res, next) => {
        try {

            const car = req.body.car

            await Car.updateCar(req.params.id, car)

            res.json({ msg: `Camion actualizado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.put('/car/:plate', [Middleware.authenticatedMiddleware, Authorization('car', 'update')], async (req, res, next) => {
        try {

            await Car.update(req.params.plate, req.body.status)

            res.json({ msg: `Camion actualizado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.put('/car/obs/:id', [Middleware.authenticatedMiddleware, Authorization('car', 'update')], async (req, res, next) => {
        try {

            await Car.updateObs(req.params.id, req.body.car.obs)

            res.json({ msg: `Camion actualizado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/car/:id', [Middleware.authenticatedMiddleware, Authorization('car', 'delete')], async (req, res, next) => {
        try {

            await Car.delete(req.params.id)

            res.json({ msg: `Camion eliminado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/dashboardcar', [Middleware.authenticatedMiddleware, Authorization('car', 'read')], async (req, res, next) => {
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