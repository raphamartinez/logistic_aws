const Answered = require('../models/answered')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/answereds', [Middleware.bearer, Authorization('answered', 'read')], async (req, res, next) => {
        try {

            let offices

            if (req.access.all.allowed) {
                const cached = await cachelist.searchValue(`office`)

                if (cached) {
                    return res.json(JSON.parse(cached))
                }

                offices = await Office.listOffice()
                cachelist.addCache(`office`, JSON.stringify(offices), 60 * 60 * 2)

            } else {
                offices = await Office.listOffice(req.login.id_login)
            }

            res.json(offices)
        } catch (err) {
            next(err)
        }
    })

    app.post('/answered', async (req, res, next) => {
        try {
            const response = req.body.response
            const msg = await Answered.insert(response)

            res.status(201).json(msg)
        } catch (err) {
            next(err)
        }
    })

    app.put('/answered/:id', async (req, res, next) => {
        try {
            const data = req.body
            const id_answered = req.params.id
            await Answered.update(data, id_answered)

            res.json({ msg: 'Respuesta actualizada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/answered/:id', async (req, res, next) => {
        try {
            const id_answered = req.params.id
            await Answered.deleteOffice(id_answered)
            res.json({ msg: 'Respuesta eliminada con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}