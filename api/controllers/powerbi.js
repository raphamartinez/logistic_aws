const PowerBi = require('../models/powerbi')

module.exports = app => {

    app.get('/powerbis/:id', async (req, res, next) => {

        try {
            const id_login = req.params.id
            
            const powerbis = await PowerBi.listPowerBi(id_login)
            res.status(200).json(powerbis)
        } catch (error) {
            next(error)
        }
    })

    app.get('/powerbis/:id', async (req, res, next) => {

        try {
            const id_login = req.params.id
            const powerbis = await PowerBi.listPowerBis(id_login)
            res.status(200).json(powerbis)
        } catch (error) {
            next(error)
        }
    })

    app.get('/powerbi/:id', async (req, res, next) => {
        try {
            const id_powerbi = req.params.id

            const user = await PowerBi.viewPowerBi(id_powerbi)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    })

    app.post('/powerbi', async (req, res, next) => {
        try {
            const powerbi = req.body.powerbi
            const result = await PowerBi.insertPowerBi(powerbi)
            res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    })

    app.put('/powerbi/:id', async (req, res, next) => {

        try {
            const id_powerbi = req.params.id
            const data = req.body
            await PowerBi.updatePowerBi(data, id_powerbi)
            res.status(200).json(true)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/powerbi/:id', async (req, res, next) => {
        try {
            const id_powerbi = req.params.id
            const result = await PowerBi.deletePowerBi(id_powerbi)
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    })
}