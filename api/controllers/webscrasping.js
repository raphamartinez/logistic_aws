const Webscrasping = require('../models/webscraping')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/webscrasping', [Middleware.authenticatedMiddleware, Authorization('user', 'read')], async (req, res, next) => {
        try {
            const session = await Webscrasping.init();

            res.json(session);
        } catch (err) {
            next(err)
        }
    })
}
