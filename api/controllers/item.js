const Item = require('../models/item')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const multer = require('multer')
const multerConfig = require('../config/multer')

module.exports = app => {

    app.get('/item', [Middleware.bearer, Authorization('item', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`item`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const items = await Item.list()
            cachelist.addCache(`item`, JSON.stringify(items), 60 * 60 * 2)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })

    app.get('/item/:plate', [Middleware.bearer, Authorization('item', 'read')], async (req, res, next) => {
        try {

            const plate = req.params.plate

            const items = await Item.list(plate)

            res.json(items)
        } catch (err) {
            next(err)
        }
    })


    app.post('/item',
        [Middleware.bearer, Authorization('item', 'create')],
        multer(multerConfig)
            .fields([{ name: 'file', maxCount: 10 }, { name: 'voucher', maxCount: 1 }]), async (req, res, next) => {

                try {
                    const files = req.files
                    const item = req.body
                    const id_login = req.login.id_login

                    const id = await Item.insert(files, item, id_login)
                    cachelist.delPrefix('item')

                    res.status(201).json({ id, msg: `Pieza agregada con éxito.` })
                } catch (err) {
                    next(err)
                }
            })

    app.put('/item/:id', [Middleware.bearer, Authorization('item', 'update')], async (req, res, next) => {
        try {
            const item = req.body.newMaintenance

            await Item.update(item, req.params.id)
            cachelist.delPrefix(`item`)

            res.json({ msg: `Pieza actualizada con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/item/:id', [Middleware.bearer, Authorization('item', 'delete')], async (req, res, next) => {
        try {
            await Item.delete(req.params.id)
            cachelist.delPrefix(`item`)

            res.json({ msg: `Pieza eliminada con éxito.` })
        } catch (err) {
            next(err)
        }
    })
}