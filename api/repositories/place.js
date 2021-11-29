const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Place {

    async insert(place, id_login) {
        try {
            const sql = `INSERT INTO accessplace (value, id_login)  VALUES (?, ?)`

            const obj = await query(sql, [place, id_login])

            return obj.insertId

        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    list(id_login) {
        try {
            const sql = `SELECT value FROM api.accessplace where id_login = ?`

            return query(sql, id_login)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async drop(id) {
        try {
            const sql = `DELETE FROM api.accessplace where id_login = ?`
            const data = await query(sql, id)

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Place()