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

    app.post('/file', [Middleware.bearer, Authorization('file', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file
            const details = req.body

            await File.save(file, details, req.login.id)

            cachelist.delPrefix('file')

            res.json({ msg: `Imagem agregada con éxito.` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/file/:key', [Middleware.bearer, Authorization('file', 'delete')], async (req, res, next) => {
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

    app.get('/file/:type/:id', [Middleware.bearer, Authorization('file', 'read')], async (req, res, next) => {
        try {
            const type = req.params.type
            const id = req.params.id

            const files = await File.list(type, id)

            res.json(files)
        } catch (err) {
            next(err)
        }
    })

    app.put('/file/:id', [Middleware.bearer, Authorization('file', 'update')], async (req, res, next) => {
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