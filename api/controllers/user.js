const User = require('../models/user')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {

    app.get('/users', [Middleware.bearer, Authorization('user', 'read')], async (req, res, next) => {
        try {
            const users = await User.list()

            res.json(users)
        } catch (err) {
            next(err)
        }
    })

    app.post('/user', [Middleware.bearer, Authorization('user', 'create')], async (req, res, next) => {
        try {
            const user = req.body.user
            const result = await User.insert(user)

            res.status(201).json({ msg: 'Usuario agregado con éxito.', result })
        } catch (err) {
            next(err)
        }
    })

    app.put('/user/:id', [Middleware.bearer, Authorization('user', 'update')], async (req, res, next) => {
        try {
            const user = req.body.newUser
            await User.update(user, req.params.id)

            res.json({ msg: 'Usuario actualizado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/user/:id', [Middleware.bearer, Authorization('user', 'delete')], async (req, res, next) => {
        try {
            await User.delete(req.params.id)

            res.json({ msg: 'Usuario eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}
