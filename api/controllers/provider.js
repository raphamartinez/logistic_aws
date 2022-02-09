const Provider = require('../models/provider')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/provider', [Middleware.authenticatedMiddleware, Authorization('provider', 'read')], async ( req, res, next) => {
        try {
            
            // const cached = await cachelist.searchValue(`proveedor`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const providers = await Provider.list()
            cachelist.addCache(`proveedor`, JSON.stringify(providers), 60 * 60 * 2)

            res.json(providers)
        } catch (err) {
            next(err)
        }
    })

    app.post('/provider', [Middleware.authenticatedMiddleware, Authorization('provider', 'create')], async ( req, res, next) => {
        try {
            cachelist.delPrefix('proveedor')
            const id = await Provider.insert(req.body.provider)

            res.status(201).json({id, msg: `Proveedor agregado con éxito.`})
        } catch (err) {
            next(err)
        }
    })

    app.put('/provider/:id', [Middleware.authenticatedMiddleware, Authorization('provider', 'update')], async ( req, res, next) => {
        try {
            const provider = req.body.newProvider
            await Provider.update(provider, req.params.id)
            cachelist.delPrefix('proveedor')

            res.json({msg: `Proveedor actualizado correctamente.`})
        } catch (err) {
            next(err)
        }
    })

    app.delete('/provider/:id', [Middleware.authenticatedMiddleware, Authorization('provider', 'delete')], async ( req, res, next) => {
        try {
            await Provider.delete(req.params.id)
            cachelist.delPrefix('proveedor')
            
            res.json({msg: `Proveedor eliminado correctamente.`})
        } catch (err) {
            next(err)
        }
    })
}