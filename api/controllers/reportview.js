const ViewPowerBi = require('../models/reportview')
const Middleware = require('../infrastructure/auth/middleware')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.post('/powerbiview', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const users = req.body.users
            const id = req.body.id
            const access = await ViewPowerBi.insertPowerBi(users, id)

            cachelist.delPrefix('powerbi')

            res.status(200).json({ msg: `PowerBi agregado con éxito.`, access })
        } catch (error) {
            next(error)
        }
    })

    app.post('/powerbisview', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const powerbis = req.body.powerbi
            const id_login = req.body.id_login
            await ViewPowerBi.insertPowerBis(powerbis, id_login)

            cachelist.delPrefix('powerbi')

            res.status(200).json({ msg: `Informes agregados con éxito ao usuario.` })
        } catch (error) {
            next(error)
        }
    })

    app.get('/powerbiview/:id_powerbi', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const powerbis = await ViewPowerBi.listPowerBi(req.params.id_powerbi)

            res.json(powerbis)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/powerbiview/:id_powerbi', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            await ViewPowerBi.delete(req.params.id_powerbi)

            res.json({msg: `Acceso ao informe caducado con éxito.`})
        } catch (error) {
            next(error)
        }
    })

}
