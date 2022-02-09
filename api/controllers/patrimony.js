const Patrimony = require('../models/patrimony')
const Middleware = require('../infrastructure/auth/middleware')
const multer = require('multer')
const multerConfig = require('../config/multer')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const aws = require('aws-sdk')
const s3 = new aws.S3()
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

module.exports = app => {

    app.get('/patrimonio', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('patrimonio')
        } catch (err) {
            next(err)
        }
    })

    app.post('/patrimony', 
    [Middleware.authenticatedMiddleware, Authorization('patrimony', 'create')],
    multer(multerConfig)
        .array('file', 10), async (req, res, next) => {
        try {
            const files = req.files
            const details = req.body

            const id = await Patrimony.insert(files, details, req.login.id_login)
            cachelist.delPrefix('patrimony')

            res.json({ id, msg: `Patrimonio agregado con éxito.` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/patrimony/:id', [Middleware.authenticatedMiddleware, Authorization('patrimony', 'delete')], async (req, res, next) => {
        try {
            await Patrimony.delete(req.params.id)

            cachelist.delPrefix('patrimony')

            res.json({ msg: `Patrimonio eliminado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/patrimony', [Middleware.authenticatedMiddleware, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`patrimony`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const patrimonys = await Patrimony.list()
            cachelist.addCache(`patrimony`, JSON.stringify(patrimonys), 60 * 60 * 2)

            res.json(patrimonys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/patrimony/route/:id', [Middleware.authenticatedMiddleware, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {
            const code = await Patrimony.last(req.params.id)

            res.json(code)
        } catch (err) {
            next(err)
        }
    })

    app.put('/patrimony/:id', [Middleware.authenticatedMiddleware, Authorization('patrimony', 'update')], async ( req, res, next) => {
        try {
            const patrimony = req.body.newPatrimony

            await Patrimony.update(patrimony)
            cachelist.delPrefix('patrimony')

            res.json({msg: `Patrimonio actualizado correctamente.`})
        } catch (err) {
            next(err)
        }
    })

    app.delete('/patrimony/:id', [Middleware.authenticatedMiddleware, Authorization('patrimony', 'delete')], async ( req, res, next) => {
        try {
            await Patrimony.delete(req.params.id)
            cachelist.delPrefix('patrimony')
            
            res.json({msg: `Patrimonio eliminado correctamente.`})
        } catch (err) {
            console.log(err);
            next(err)
        }
    })
}