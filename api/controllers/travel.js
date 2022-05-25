const Travel = require('../models/travel')
const TravelReport = require('../models/travelreport')

const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/travel', [Middleware.authenticatedMiddleware, Authorization('travel', 'create')], async (req, res, next) => {
        try {
            const travel = req.body.travel

            const id = await Travel.insert(travel, req.login.id_login)
            cachelist.delPrefix(`travel`)

            res.json({ id, msg: `Viaje agregada con éxito.` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/travel/:id', [Middleware.authenticatedMiddleware, Authorization('travel', 'delete')], async (req, res, next) => {
        try {
            await Travel.delete(req.params.id)

            cachelist.delPrefix('travel')

            res.json({ msg: `Viaje eliminada con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/travel/:date', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            let travels
            const date = req.params.date
            const period = false

            if (req.access.all.allowed) {
                travels = await Travel.list(date, period, req.login.id_login)

            } else {
                travels = await Travel.list(date, period, req.login.id_login)
            }

            res.json(travels)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/travel/hystory/:id', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id

            const history = await Travel.history(id)

            res.json(history)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/travel/report/strategic/:date', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            const date = req.params.date

            const history = await TravelReport.reportStrategic(id)

            res.json(history)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })


    app.get('/cars/enable/:date/:period', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            let cars
            const date = req.params.date
            const period = req.params.period

            if (req.access.all.allowed) {
                cars = await Travel.listPeriodCar(date, period)

            } else {
                cars = await Travel.listPeriodCar(date, period, req.login.places)
            }

            res.json(cars)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/travelperiod/:date/:period', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            let travels
            const date = req.params.date
            const period = req.params.period

            if (req.access.all.allowed) {
                travels = await Travel.list(date, period)
            } else {
                travels = await Travel.list(date, period, req.login.id_login)
            }

            res.json(travels)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })
}