const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Travel {

    async list(date, period) {
        try {
            let sql = `SELECT tr.id, tr.period, IF(tr.period = 1, "Mañana", "Noche") as perioddesc, DATE_FORMAT(tr.date, '%d/%m/%Y') as datedesc, dr.id as id_driver, dr.name as driverdesc ,
            CASE
            WHEN tr.route = 1 THEN "KM 1"
            WHEN tr.route = 2 THEN "KM 28"
            WHEN tr.route = 3 THEN "YPANÉ"
            WHEN tr.route = 4 THEN "AC. KM 1"
            WHEN tr.route = 5 THEN "LOG. HERRAMIENTAS"
            WHEN tr.route = 6 THEN "LOG. VEHÍCULOS"
            WHEN tr.route = 7 THEN "LOG. EQUIPOS"
            ELSE "Ninguno local definido."
        END as routedesc
            FROM api.travel tr
            INNER JOIN api.driver dr ON dr.id = tr.id_driver
            WHERE tr.date = ? `

            if(period) sql += `AND tr.period = '${period}'`

            const data = await query(sql, date)
            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async listPlates (id) {
        try {
            const sql = `SELECT tc.id, tc.id_car, tc.type, ca.plate
            FROM api.travelcar tc
            INNER JOIN api.car ca ON tc.id_car = ca.id
            WHERE tc.id_travel = ?`

            return query(sql, id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

   async insert(car, id_login) {
        try {
            const sql = `INSERT INTO travel (date, period, route, id_driver, id_login, datereg)  VALUES (?, ?, ?, ?, ?, now() - interval 4 hour  )`

            await query(sql, [car.date, car.period, car.route, car.driver, id_login])

            const sqlId = 'select LAST_INSERT_ID() as id from api.travel LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async delete(id) {
        try {
            const sqlcar = `DELETE FROM api.travelcar WHERE id_travel = ?`

            await query(sqlcar, id)

            const sql = `DELETE FROM api.travel WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    insertCar(car, id, type) {

        try {
            const sql = `INSERT INTO travelcar (id_car, id_travel, type)  VALUES (?, ?, ?)`

            return query(sql, [car, id, type])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Travel()