const TravelReport = require('../models/travelreport')
const Travel = require('../models/travel')

const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.post('/travelreport', [Middleware.bearer, Authorization('travel', 'create')], async (req, res, next) => {
        try {
            const travel = req.body.travel

            const b64string = await TravelReport.insert(travel)
            res.setHeader('Content-Disposition', 'attachment; filename=MyDocument.docx');
            res.send(Buffer.from(b64string, 'base64'));
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.put('/travelreport/:id', [Middleware.bearer, Authorization('travel', 'delete')], async (req, res, next) => {
        try {
            const travel = req.body.travel
            const id = req.params.id

            await TravelReport.update(travel, id)

            res.json({ msg: `Descripción del informe actualizado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/travelreport/:id', [Middleware.bearer, Authorization('travel', 'delete')], async (req, res, next) => {
        try {
            await TravelReport.delete(req.params.id)

            res.json({ msg: `Descripción del informe eliminada con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/travelreport/:id_car/:type/:origin/:route/:id_travel', [Middleware.bearer, Authorization('travel', 'read')], async (req, res, next) => {
        try {

            const report = {
                id_travel: req.params.id_travel,
                type: req.params.type,
                id_car: req.params.id_car,
                origin: req.params.origin,
                route: req.params.route
            }
            const travel = await Travel.view(report.id_travel)

            const travelreport = await TravelReport.list(report)

            res.json({ travelreport, travel })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/travelreport/:id_car/:type/:origin/:route/:id_travel', [Middleware.bearer, Authorization('travel', 'read')], async (req, res, next) => {
        try {

            const report = {
                id_travel: req.params.id_travel,
                type: req.params.type,
                id_car: req.params.id_car,
                origin: req.params.origin,
                route: req.params.route
            }
            const travel = await Travel.view(report.id_travel)

            const travelreport = await TravelReport.list(report)

            res.json({ travelreport, travel })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })
}