const File = require('../models/file')
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

    app.get('/documientos', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('documentacion')
        } catch (err) {
            next(err)
        }
    })

    app.post('/file', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], multer(multerConfig).array('file', 10), async (req, res, next) => {
        try {
            const files = req.files
            const details = req.body

            await File.insert(files, details, req.login.id_login)

            res.json({ msg: `Imagen agregada con éxito.` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.post('/file/order', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file
            const details = req.body

            const {status, id} = await File.insertOrder(file, details, req.login.id_login)
            res.json({status, id})
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.get('/file/order/:purchaseorder', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const purchaseorder = req.params.purchaseorder
            const archives = await File.listOrders(purchaseorder)
            res.json(archives)
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/file/order/:id', [Middleware.authenticatedMiddleware, Authorization('file', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const id = req.params.id
            const filename = await File.deleteOrder(id)
            s3.deleteObject({
                Bucket: 'logisticrepositorie',
                Key: filename
            }).promise()

            res.json({ ok: true, msg: `¡Archivo eliminado con éxito!` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/file/:key', [Middleware.authenticatedMiddleware, Authorization('file', 'delete')], async (req, res, next) => {
        try {

            if (process.env.STORAGE_TYPE === 's3') {
                s3.deleteObject({
                    Bucket: 'logisticrepositorie',
                    Key: req.params.key
                }).promise()
            } else {
                return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", req.params.key))
            }

            await File.delete(req.params.key)

            cachelist.delPrefix('file')

            res.json({ msg: `Archivo eliminado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/file/:type/:id?', [Middleware.authenticatedMiddleware, Authorization('file', 'read')], async (req, res, next) => {
        try {
            const type = req.params.type
            const id = req.params.id

            const files = await File.list(type, id)

            res.json(files)
        } catch (err) {
            next(err)
        }
    })

    app.put('/file/:id', [Middleware.authenticatedMiddleware, Authorization('file', 'update')], async (req, res, next) => {
        try {
            const file = req.body.file
            const id = req.params.id

            await File.update(file, id)

            res.json({msg: `Archivo actualizado con éxito.`})
        } catch (err) {
            next(err)
        }
    })
}