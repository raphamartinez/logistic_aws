const Repositorie = require('../repositories/quiz')
const fs = require('fs');
const path = require('path')
const reqPath = path.join(__dirname, '../../')
const bcrypt = require('bcrypt')
const Token = require('./token')
const { QuizMail } = require('./mail')
const nodemailer = require('nodemailer')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Quiz {

    async finish(token, comment) {
        try {
            const id = await Token.verifyQuiz.verify(token)
            await Token.verifyQuiz.invalid(token)

            await Repositorie.update(id, comment)

            return true
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async finishRobot() {
        try {
            const interviews = await Repositorie.listFinish()

            await interviews.forEach(async interview => {
                await Repositorie.update(interview.id, `Terminado automáticamente por el sistema.`)
            })

            return true
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    // async insert() {
    //     try {

    //         for (const report of obj.reports) {
    //             const id_quiz = await Repositorie.insertQuiz(report)

    //             for (const question of report.questions) {
    //                 const id_question = await Repositorie.insertQuestion(question, id_quiz)

    //                 await question.answer.forEach(async answer => {
    //                     console.log(answer);
    //                     if (answer) {
    //                         const id_answer = await Repositorie.insertAnswer(answer, id_question)
    //                     }
    //                 })

    //             }
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
    //     }
    // }

    async update() {
        try {

            const result = await Repositorie.update()
            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }

    async delete() {
        try {
            const result = await Repositorie.delete()
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar la sucursal.')
        }
    }

    list() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }

    listInterview() {
        try {
            return Repositorie.listInterview()
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }

    listGraph(type, id_interview) {
        try {
            return Repositorie.listGraph(type, id_interview)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }

    async sendQuiz(user, quiz, id_login) {
        try {
            let id = await Repositorie.insertInterview(user, quiz, id_login)

            const token = await Token.verifyQuiz.create(id)
            const send = new QuizMail(user, quiz, token)

            const transport = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            })

            transport.sendMail(send, (err, info) => {
                if(err){
                  console.log(err)
                }
                else{
                    console.log(info);
                }
                  
             });

            return id
        } catch (error) {
            throw new InvalidArgumentError('No se pudo solicitar la recuperación de la contraseña.')
        }
    }

    async check(token) {
        try {
            if (typeof token !== 'string' || token.lenght === 0) {
                throw new InvalidArgumentError('O token está inválido')
            }

            const id_interview = await Token.verifyQuiz.verify(token)

            if (id_interview) {
                const check = await Repositorie.check(id_interview)

                if (check) return true
            }

            return false
        } catch (error) {
            return false
        }
    }

    async viewAdmin(id_quiz) {
        try {
            let data = await Repositorie.listQuestions(id_quiz)

            let questions = []
            for (let question of data) {
                const answers = await Repositorie.listAnswers(question.id)
                question.answers = answers

                questions.push(question)
            }

            return questions
        } catch (error) {
            throw new InvalidArgumentError('No se pudo solicitar la recuperación de la contraseña.')
        }
    }

    async view(token) {
        try {
            if (typeof token !== 'string' || token.lenght === 0) {
                throw new InvalidArgumentError('O token está inválido')
            }

            const id_interview = await Token.verifyQuiz.verify(token)

            let quiz = await Repositorie.view(id_interview)

            let data = await Repositorie.listQuestions(quiz.id_quiz)

            let questions = []
            for (let question of data) {
                const answers = await Repositorie.listAnswers(question.id)
                question.answers = answers

                questions.push(question)
            }

            quiz.questions = questions
            quiz.id_interview = id_interview

            return quiz
        } catch (error) {
            throw new InvalidArgumentError('No se pudo solicitar la recuperación de la contraseña.')
        }
    }
}

module.exports = new Quiz