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
            const sql = `SELECT * FROM api.driver where status > 0`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listPeriodDriver(date, period) {
        let sql = `SELECT dr.name, dr.id, dr.status as status_driver FROM api.driver dr
        WHERE dr.id NOT IN (
        SELECT tr.id_driver
        FROM api.travel tr
        INNER JOIN api.driver dr ON dr.id = tr.id_driver
        WHERE tr.date = ? AND tr.period = ?
        GROUP BY id_driver
        ORDER BY id_driver
        ) AND dr.status  = 1
        GROUP BY dr.id
        ORDER BY dr.name`

        return query(sql, [date, period])
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