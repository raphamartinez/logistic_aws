const Stock = require('../models/stock')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/stock', [Middleware.authenticatedMiddleware, Authorization('stock', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`stock`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const stocks = await Stock.list()
            cachelist.addCache(`stock`, JSON.stringify(stocks), 60 * 60 * 2)

            res.json(stocks)
        } catch (err) {
            next(err)
        }
    })

    app.post('/stock', [Middleware.authenticatedMiddleware, Authorization('stock', 'create')], async (req, res, next) => {
        try {
            const result = await Stock.insert(req.body)
            cachelist.delPrefix('stock')

            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/stock/:id', [Middleware.authenticatedMiddleware, Authorization('stock', 'update')], async (req, res, next) => {
        try {
            const data = req.body

            const result = await Stock.update(data, req.params.id)
            cachelist.delPrefix('stock')

            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/stock/:id', [Middleware.authenticatedMiddleware, Authorization('stock', 'delete')], async (req, res, next) => {
        try {
            const result = await Stock.delete(req.params.id)
            cachelist.delPrefix('stock')

            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}