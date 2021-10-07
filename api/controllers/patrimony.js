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

    app.post('/patrimony', 
    [Middleware.bearer, Authorization('patrimony', 'create')],
    multer(multerConfig)
        .array('file', 10), async (req, res, next) => {
        try {
            const files = req.files
            const details = req.body

            await Patrimony.insert(files, details, req.login.id_login)
            cachelist.delPrefix('patrimony')

            res.json({ msg: `Patrimonio agregado con éxito.` })
        } catch (err) {
            console.log(err);
            next(err)
        }
    })

    app.delete('/patrimony/:key', [Middleware.bearer, Authorization('patrimony', 'delete')], async (req, res, next) => {
        try {

            if (process.env.STORAGE_TYPE === 's3') {
                s3.deleteObject({
                    Bucket: 'logisticrepositorie',
                    Key: req.params.key
                }).promise()
            } else {
                return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", req.params.key))
            }

            await Patrimony.delete(req.params.key)

            cachelist.delPrefix('patrimony')

            res.json({ msg: `Patrimonio eliminado con éxito.` })
        } catch (err) {
            next(err)
        }
    })

    app.get('/patrimony', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
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

    app.get('/patrimony/route/:id', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {
            console.log(req.params.id);
            const code = await Patrimony.last(req.params.id)

            res.json(code)
        } catch (err) {
            next(err)
        }
    })
}