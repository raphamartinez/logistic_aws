const Quotation = require('../models/quotation')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const multer = require('multer')
const multerConfig = require('../config/multer')
module.exports = app => {

    app.get('/quotation', [Middleware.bearer, Authorization('quotation', 'read')], async (req, res, next) => {
        try {
            // cachelist.delPrefix('quotation')

            // const cached = await cachelist.searchValue(`quotation`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const quotations = await Quotation.list()
            // cachelist.addCache(`quotation`, JSON.stringify(quotations), 60 * 60 * 1)

            res.json(quotations)
        } catch (err) {
            next(err)
        }
    })

    app.post('/quotation', [Middleware.bearer, Authorization('quotation', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {

            const file = req.file
            const quotation = req.body
            const id_login = req.login.id_login

            const quotations = await Quotation.insert(file, quotation, id_login)
            cachelist.addCache(`quotation`, JSON.stringify(quotations), 60 * 60 * 2)

            res.json(quotations)
        } catch (err) {
            next(err)
        }
    })
}