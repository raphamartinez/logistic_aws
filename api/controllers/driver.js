const Driver = require('../models/driver')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/drivers', [Middleware.bearer, Authorization('driver', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`driver`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const drivers = await Driver.list()
            cachelist.addCache(`driver`, JSON.stringify(drivers), 60 * 60 * 2)

            res.json(drivers)
        } catch (err) {
            next(err)
        }
    })

    app.put('/driver/:id', [Middleware.bearer, Authorization('driver', 'update')], async (req, res, next) => {
        try {
            await Driver.update(req.params.id, req.body.status)
            res.json({ msg: `Chofér actualizado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.put('/driver/obs/:id', [Middleware.bearer, Authorization('driver', 'update')], async ( req, res, next) => {
        try {

            await Driver.updateObs(req.params.id, req.body.driver.obs)

            res.json({msg: `Chofér actualizado con éxito.`})
        } catch (err) {
            next(err)
        }
    })
}