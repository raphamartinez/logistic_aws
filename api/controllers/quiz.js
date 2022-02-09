const Quiz = require('../models/quiz')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')


module.exports = app => {

    app.get('/cuestionario', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {
            res.render('quiz')
        } catch (err) {
            next(err)
        }
    })

    app.get('/quiz', [Middleware.authenticatedMiddleware, Authorization('quiz', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue('quiz')

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const questionnaires = await Quiz.list()

            await cachelist.addCache('quiz', JSON.stringify(questionnaires), 60 * 60 * 2)

            res.json(questionnaires)
        } catch (err) {
            next(err)
        }
    })

    app.get('/interviews', [Middleware.authenticatedMiddleware, Authorization('quiz', 'read')], async (req, res, next) => {
        try {
            const interviews = await Quiz.listInterview()

            res.json(interviews)
        } catch (err) {
            next(err)
        }
    })

    app.get('/interview/:type/:id', [Middleware.authenticatedMiddleware, Authorization('quiz', 'read')], async (req, res, next) => {
        try {
            const responses = await Quiz.listGraph(req.params.type, req.params.id)
            res.json(responses)
        } catch (err) {
            next(err)
        }
    })

    app.get('/viewquiz/:id_quiz', [Middleware.authenticatedMiddleware, Authorization('quiz', 'read')], async (req, res, next) => {
        try {
            const id_quiz = req.params.id_quiz

            // const cached = await cachelist.searchValue(`quiz/${id_quiz}`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const quiz = await Quiz.viewAdmin(id_quiz)

            await cachelist.addCache(`quiz/${id_quiz}`, JSON.stringify(quiz), 60 * 60 * 2)

            res.json(quiz)
        } catch (err) {
            next(err)
        }
    });

    app.get('/quiz/public/:token', async function (req, res, next) {
        try {
            const token = req.params.token

            if (token !== undefined) {


                const check = await Quiz.check(token)

                if (check) {
                    res.render('cuestionario')
                } else {
                    res.redirect('http://54.161.250.7/')
                }
            } else {
                res.redirect('http://54.161.250.7/')

            }
        } catch (err) {
            next(err)
        }
    });

    app.post('/quiz', [Middleware.authenticatedMiddleware, Authorization('quiz', 'create')], async (req, res, next) => {
        try {
            const user = req.body.user
            const quiz = req.body.quiz

            const id = await Quiz.sendQuiz(user, quiz, req.login.id_login)
            cachelist.delPrefix('quiz')

            res.status(201).json({ msg: 'Email enviado con éxito.', id })
        } catch (err) {
            next(err)
        }
    })


    app.get('/quiz/:token', async function (req, res, next) {
        try {
            const token = req.params.token

            // const cached = await cachelist.searchValue(`quiz/${token}`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const quiz = await Quiz.view(token)
            await cachelist.addCache(`quiz/${token}`, JSON.stringify(quiz), 60 * 60 * 2)

            res.json(quiz)
        } catch (err) {
            next(err)
        }
    });

    app.post('/quiz/finish/:token', async (req, res, next) => {
        try {
            const token = req.params.token
            const comment = req.body.comment

            await Quiz.finish(token, comment)
            cachelist.delPrefix('quiz')

            res.status(201).json({ msg: 'Cuestionario cerrado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

}