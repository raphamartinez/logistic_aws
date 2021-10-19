const Travel = require('../models/travel')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/travel', [Middleware.bearer, Authorization('travel', 'create')], async (req, res, next) => {
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

    app.delete('/travel/:id', [Middleware.bearer, Authorization('travel', 'delete')], async (req, res, next) => {
        try {
            await Travel.delete(req.params.id)

            cachelist.delPrefix('travel')

            res.json({ msg: `Viaje eliminada con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/travel/:date', [Middleware.bearer, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            const date = req.params.date

            const travels = await Travel.list(date)

            res.json(travels)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/travelperiod/:date/:period', [Middleware.bearer, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            const date = req.params.date
            const period = req.params.period

            const travels = await Travel.list(date, period)

            res.json(travels)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })
}