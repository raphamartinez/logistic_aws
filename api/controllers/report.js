const PowerBi = require('../models/report')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/powerbis/:type?', [Middleware.bearer, Authorization('report', 'read')], async (req, res, next) => {
        try {
            let id = req.login.id_login
            let type = req.params.type

            if (req.login.profile === 4 && type == undefined) id = false

            let powerbis = await PowerBi.list(id, type)

            res.json({ powerbis, profile: req.login.profile })
        } catch (err) {
            next(err)
        }
    })


    app.get('/powerbis/id_login/:id_login', [Middleware.bearer, Authorization('report', 'read')], async (req, res, next) => {

        try {
            let id_login = req.params.id_login;
            if(id_login) id_login = req.login.id_login;
            const powerbis = await PowerBi.list(id_login, false)
            res.json(powerbis)
        } catch (err) {
            next(err)
        }
    })

    app.get('/powerbi/:id', [Middleware.bearer, Authorization('report', 'read')], async (req, res, next) => {
        try {
            const id_powerbi = req.params.id
            const user = await PowerBi.viewPowerBi(id_powerbi)

            res.json(user)
        } catch (err) {
            next(err)
        }
    })

    app.post('/powerbi', [Middleware.bearer, Authorization('report', 'create')], async (req, res, next) => {
        try {
            const powerbi = req.body.powerbi
            const id = await PowerBi.insertPowerBi(powerbi)

            cachelist.delPrefix('powerbi')

            res.status(201).json({ msg: 'PowerBi agregado con éxito.', id })
        } catch (err) {
            next(err)
        }
    })

    app.put('/powerbi/:id', [Middleware.bearer, Authorization('report', 'update')], async (req, res, next) => {

        try {
            const id_powerbi = req.params.id
            const report = req.body.report

            await PowerBi.updatePowerBi(report, id_powerbi)

            cachelist.delPrefix('powerbi')

            res.json({ msg: `PowerBi editado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/powerbi/:id', [Middleware.bearer, Authorization('report', 'delete')], async (req, res, next) => {
        try {
            const id_powerbi = req.params.id
            await PowerBi.deletePowerBi(id_powerbi)

            cachelist.delPrefix('powerbi')

            res.json({ msg: `PowerBi excluido con éxito.` })
        } catch (err) {
            next(err)
        }
    })
}
