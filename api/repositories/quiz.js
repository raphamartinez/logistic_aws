const query = require('../infrastructure/database/queries')
const querytwo = require('../infrastructure/database/queriestwo')

const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Quiz {

    async answer() {
        let title = ''

        for (let index = 30; index < 31; index++) {

            title = `Cuadro ${index}`

            const sql1 = 'INSERT INTO api.question (title, type, id_quiz) VALUES (?, ?, ?)'
            await query(sql1, [title, 'int', 9])

            const sql2 = 'INSERT INTO ansa.question (title, type, id_quiz) VALUES (?, ?, ?)'
            await querytwo(sql2, [title, 'int', 9])
        }

    }

    async insertQuiz(obj) {
        try {
            const sql = 'INSERT INTO quiz (title, status, datereg) values (?, ?, now() - interval 3 hour )'
            await query(sql, [obj.title, 1])

            const sqlId = 'select LAST_INSERT_ID() as id from ansa.quiz LIMIT 1'
            const t = await query(sqlId)
            return t[0].id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async insertQuestion(obj, id) {
        try {
            const sql = 'INSERT INTO question (title, type, id_quiz) values (?, ?, ?)'
            await query(sql, [obj.title, obj.type, id])

            const sqlId = 'select LAST_INSERT_ID() as id from ansa.question LIMIT 1'
            const t = await query(sqlId)
            return t[0].id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async insertAnswer(obj, id) {
        try {
            const sql = 'INSERT INTO answer (title, id_question) values (?, ?)'
            await query(sql, [obj, id])

            const sqlId = 'select LAST_INSERT_ID() as id from ansa.answer LIMIT 1'
            const t = await query(sqlId)
            return t[0].id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async insertInterview(user, quiz, id_login) {
        try {
            const sql = 'INSERT INTO api.interview (id_quiz, mail, name, status, id_login, datereg) values (?, ?, ?, ?, ?, now() - interval 3 hour)'
            const result = await query(sql, [quiz.id_quiz, user.mail, user.name, 1, id_login])

            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }


    async update(id, comment) {
        try {
            const sql = `UPDATE interview set comment = ?, status = ? WHERE id = ?`
            const result = await query(sql, [comment, 0, id])
            return result[0]
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    async check(id_interview) {
        try {
            const sql = `SELECT id
            FROM api.interview
            WHERE id = ? AND status = 1`

            const result = await query(sql, id_interview)
            return result[0]
        } catch (error) {
            throw new NotFound('Error de vista previa de la sucursal')
        }
    }


    async view(id_interview) {
        try {
            const sql = `SELECT it.id_quiz, it.mail, it.name, it.status, it.datereg, it.id as id_interview
            FROM api.interview it
            WHERE it.id = ?`

            const result = await query(sql, id_interview)
            return result[0]
        } catch (error) {
            throw new NotFound('Error de vista previa de la sucursal')
        }
    }

    list() {
        try {
            const sql = `SELECT qu.id, qu.title, qu.status, DATE_FORMAT(qu.datereg, '%H:%i %d/%m/%Y') as datereg, 
            COUNT(iv.id) as interviews
            FROM api.quiz qu
            LEFT JOIN api.interview iv ON qu.id = iv.id_quiz
            GROUP BY qu.id
            ORDER BY qu.id DESC`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    listQuestions(id_quiz) {
        try {
            const sql = `SELECT qe.id, qe.title, qe.type 
            FROM api.question qe
            INNER JOIN api.quiz qu ON qe.id_quiz = qu.id
            WHERE qu.id = ?`

            return query(sql, id_quiz)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    listAnswers(id_question) {
        try {
            const sql = `SELECT an.id, an.title
            FROM api.answer an
            INNER JOIN api.question qu ON an.id_question = qu.id
            WHERE qu.id = ?`

            return query(sql, id_question)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    listInterview() {
        try {
            const sql = `SELECT * FROM api.interview WHERE status = 0`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }

    async listFinish() {
        try {
            const sql = `SELECT * FROM api.interview WHERE datereg > DATE_ADD(now() - interval 3 hour , INTERVAL -1 DAY) and status = 1`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }


    listGraph(type, id_interview) {
        try {
            let sql

            switch (type) {
                case "7":
                    sql = `
                    SELECT TRUNCATE(AVG(ad.value),2) as average, qu.classification
                    FROM api.question qu
                    LEFT JOIN api.answeredinterview ad ON qu.id = ad.id_question
                    WHERE qu.id_quiz = 7
                    AND ad.id_interview = ?
                    GROUP BY classification
                    ORDER BY classification`
                    break

                case "8":

                    sql = `
                    SELECT TRUNCATE(AVG(ad.value),2) as average, an.classification
                    FROM api.answer an
                    INNER JOIN api.question qu ON an.id_question = qu.id
                    LEFT JOIN api.answeredinterview ad ON an.id = ad.id_answer
                    WHERE qu.id_quiz = 8
                    AND ad.id_interview = ?
                    GROUP BY classification
                    ORDER BY classification`
                    break
            }

            return query(sql, id_interview)

        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las sucursais')
        }
    }
}

module.exports = new Quiz()