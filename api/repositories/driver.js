const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Driver {

   async insert(driver) {
        try {
            const sql = `INSERT INTO driver (name, idcard, phone, thirst, type, classification, vacation, obs, status, dateReg)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 3 hour)`

            const obj = await query(sql, [driver.name, driver.idcard, driver.phone, driver.thirst, driver.type, driver.classification, driver.vacation, driver.obs, 1])

            return obj.insertId

        } catch (error) {
            console.log(error);
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

    async updateDriver(id, driver) {
        try {
            const sql = `UPDATE api.driver SET name = ?, idcard = ?, phone = ?, thirst = ?, type = ?, classification = ?, vacation = ?, obs = ? where id = ?`
            const data = await query(sql, [driver.name, driver.idcard, driver.phone, driver.thirst, driver.type, driver.classification, driver.vacation, driver.obs, id])

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