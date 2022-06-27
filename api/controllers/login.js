const Login = require('../models/login')
const Middleware = require('../infrastructure/auth/middleware')
const path = require('path')
const passport = require('passport');

module.exports = app => {

    app.get('/login', async function (req, res, next) {
        try {
            if (req.query.fail) {
                req.flash('error', '¡Nombre de usuario y/o contraseña inválido!');
                res.redirect('login');
            } else
                res.render('login');
        } catch (err) {
            next(err)
        }
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login?fail=true'
    }));

    app.get('/dashboard', async function (req, res, next) {
        try {
            let id_login = false;
            let url = 'dashboard';

            if (req.session.passport) {
                id_login = req.session.passport.user;
            } else {
                id_login = req.login.id_login;
            }

            const login = await Login.viewLogin(id_login);

            switch (login.perfil) {
                case 1:
                    url = 'reemplazar';
                    break;
                case 2:
                    url = 'patrimonio';
                    break;
                case 3:
                    url = 'vehiculos';
                    break;
                case 4:
                    url = 'vehiculos';
                    break;
            }

            res.render(url,{
                perfil: login.profile,
                username: login.name
            });
            
        } catch (err) {
            res.redirect('login?fail=true')
        }
    });


    app.post('/salir', async function (req, res, next) {
        try {
            req.logout()
            res.redirect('/')
        } catch (err) {
            next(err)
        }

    });

    app.post('/insertLogin', Middleware.authenticatedMiddleware, async function (req, res, next) {
        try {
            const data = req.body
            await Login.insertLogin(data)
            res.sendFile('login.html', { root: path.join(__dirname, '../../views/public') });
        } catch (err) {
            next(err)
        }
    });

    app.get('/forgotPassword', async function (req, res, next) {
        try {
            res.render('forgotPassword');
        } catch (err) {
            next(err)
        }
    });

    app.post('/forgotPassword', async function (req, res, next) {
        try {
            const mailenterprise = req.body.mail
            const login = await Login.forgotPassword(mailenterprise)

            res.json({ url: '../', message: 'Correo electrónico de restablecimiento de contraseña enviado!' })
        } catch (err) {
            next(err)
        }
    });

    app.get('/newPassword/:token', async function (req, res, next) {
        try {
            res.render('password')
        } catch (err) {
            next(err)
        }
    });

    app.post('/resetPassword', async function (req, res, next) {
        try {
            const token = req.body.token
            const password = req.body.password
            const id_login = await Login.changePassword(token, password)

            res.json({ url: '../', message: 'Contraseña alterada con éxito!' })
        } catch (err) {
            next(err)
        }
    });

    app.post('/changepass', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            const user = req.body.user
            await Login.updatePassword(user)

            res.json({ msg: `Contraseña cambiada con éxito.` })
        } catch (err) {
            next(err)
        }
    })
}