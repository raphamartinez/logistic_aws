const Provider = require('../models/provider')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/provider', [Middleware.bearer, Authorization('provider', 'read')], async ( req, res, next) => {
        try {
            
            // const cached = await cachelist.searchValue(`provider`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const providers = await Provider.list()
            cachelist.addCache(`provider`, JSON.stringify(providers), 60 * 60 * 12)

            res.json(providers)
        } catch (err) {
            next(err)
        }
    })

    app.post('/provider', [Middleware.bearer, Authorization('provider', 'create')], async ( req, res, next) => {
        try {
            const result = await Provider.insert(req.body.provider)

            cachelist.delPrefix('provider')

            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/provider/:id', [Middleware.bearer, Authorization('provider', 'update')], async ( req, res, next) => {
        try {
            const data = req.body
            const result = await Provider.update(data, req.params.id)
            cachelist.delPrefix('provider')

            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/provider/:id', [Middleware.bearer, Authorization('provider', 'delete')], async ( req, res, next) => {
        try {
            const result = await Provider.delete(req.params.id)
            cachelist.delPrefix('provider')
            
            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}