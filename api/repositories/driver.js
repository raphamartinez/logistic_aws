const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Driver {

    insert(car) {
        try {
            const sql = `INSERT INTO driver (id, name, idcard, phone, thirst, id_car, type, classification, vacation)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`

            return query(sql, car)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    list() {
        try {
            const sql = `SELECT * FROM api.driver `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async update(id, status) {
        try {
            const sql = `UPDATE api.driver SET status = ? where id = ?`
            const data = await query(sql, [status, id])

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    updateObs(id, obs) {
        try {
            const sql = `UPDATE api.driver SET obs = ? where id = ?`
            return query(sql, [obs, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Driver()