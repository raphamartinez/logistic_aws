const ShortUrl = require('../models/shorturl')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/encurtador', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const pages = await ShortUrl.list()
            res.render('shorturl', {
                pages
            })
        } catch (err) {
            next(err)
        }
    })

    app.get('/e/:token', async (req, res, next) => {
        try {
            const token = req.params.token
            const page = await ShortUrl.verify(token)
            if (page.url) {
                res.redirect(page.url)
            } else {
                res.render('error-http', {
                    error: page.error,
                    msg: page.msg
                })
            }

        } catch (err) {
            next(err)
        }
    });

    app.post('/encurtador', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const page = req.body
            const result = ShortUrl.insert(page)
            if (result) res.redirect('/encurtador')
        } catch (err) {
            next(err)
        }
    })

    app.put('/encurtador/:id', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const id = req.params.id
            const page = req.body.page
            await ShortUrl.update(page, id)
            res.redirect('/encurtador')
        } catch (err) {
            next(err)
        }
    })

    app.delete('/encurtador/:id', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const id = req.params.id
            await ShortUrl.delete(id)
            res.json({ ok: true, msg: 'Url borrada con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}