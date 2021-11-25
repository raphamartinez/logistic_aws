const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')


class TravelReport {

    async insert(travel) {

        try {
            const sql = `INSERT INTO travelreport (id_car, origin, route, type)  VALUES (?, ?, ?, ?)`

            const obj = await query(sql, [travel.id_car, travel.origin, travel.route, travel.type])

            return obj.insertId
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    async insertDetail(travel, id_travelreport) {

        try {
            const sql = `INSERT INTO travelreportdetail (description, value, type, id_travelreport)  VALUES (?, ?, ?, ?)`

            const obj = await query(sql, [travel.comment, travel.value, travel.type, id_travelreport])

            return obj.insertId
        } catch (error) {
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    async check(travel) {
        try {
            const sql = `SELECT tr.id
            FROM api.travelreport tr
            WHERE tr.id_car = ? AND tr.origin = ? AND tr.route = ?`

            const obj = await query(sql, [travel.id_car, travel.origin, travel.route])

            return obj[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    async list(travel) {
        try {
            const sql = `SELECT tr.id, ca.plate, tr.id_car, tr.origin, tr.route, tr.type
            FROM api.travelreport tr
            INNER JOIN api.car ca ON tr.id_car = ca.id 
            WHERE tr.id_car = ? AND tr.origin = ? AND tr.route = ? AND tr.type = ?`

            const data = await query(sql, [travel.id_car, travel.origin, travel.route, travel.type])

            return data[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    async listDetail(id) {
        try {
            const sql = `SELECT td.id, td.description, td.value, td.type
            FROM api.travelreportdetail td
            WHERE td.id_travelreport = ?`

            const data = await query(sql, id)

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    update(detail) {
        try {
            const sql = `UPDATE travelreportdetail SET description = ?, value = ? WHERE id = ?`

            return query(sql, [detail.description, detail.value, detail.id])
        } catch (error) {
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }

    delete(id) {
        try {
            const sql = `DELETE FROM travelreportdetail WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron agregar los datos')
        }
    }
}

module.exports = new TravelReport()