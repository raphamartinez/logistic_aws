const Travel = require('../models/travel')
const TravelReport = require('../models/travelreport')
const ejs = require('ejs')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const path = require('path')
const puppeteer = require('puppeteer')

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

    app.get('/travel/pdf/strategic/:date', [Middleware.authenticatedMiddleware, Authorization('travel', 'read')], async (req, res, next) => {
        try {
            const date = req.params.date
            const dt = new Date(date)

            const browser = await puppeteer.launch({headless: false,
                args: ['--no-sandbox']})
            const page = await browser.newPage()

            await page.goto(`https://sistema.olla.com.py/travel/report/strategic/${dt}`, {
                waitUntil: 'networkidle0'
            })

            const pdf = await page.pdf({
                printBackground: true,
                format: 'A4'
            })

            await browser.close()

            res.contentType('application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=informe.pdf');
            return res.send(Buffer.from(pdf, 'base64'));
        } catch (err) {
            console.log(err);
            next(err)
        }
    })


    app.get('/travel/report/strategic/:date', async (req, res, next) => {
        try {
            const date = req.params.date

            const data = await TravelReport.reportStrategic(date)

            const startDate = new Date(date)
            const month = startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : `0${startDate.getMonth() + 1}`
            const day = startDate.getDate() > 9 ? startDate.getDate() : `0${startDate.getDate()}`
            const minutes = startDate.getMinutes() > 9 ? startDate.getMinutes() : `0${startDate.getMinutes()}`
            const hours = startDate.getHours() > 9 ? startDate.getHours() : `0${startDate.getHours()}`
    

            const filePath = path.join(__dirname, "../../views/admin/reports/strategic-pdf.ejs")
            ejs.renderFile(filePath, { data, day: `${day}/${month}/${startDate.getFullYear()}`, time: `${hours}:${minutes}` }, async (err, html) => {
                if (err) {
                    return res.send('Erro na leitura do arquivo')
                }

                return res.send(html)
            })
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