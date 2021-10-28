const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Car { 

    liststatus() {
        try {
            const sql = `SELECT *, DATE_FORMAT(year, '%Y') as year, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as date FROM api.car WHERE status = 2 `
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    list() {
        try {
            const sql = `SELECT IF(it.status = 0,COUNT(it.id),0) as amountPending, IF(qt.status = 1,COUNT(it.id),0) as amountQuoted, 
            IF(qt.status = 2,COUNT(it.id),0) as amountApproved, IF(qt.status = 3,COUNT(it.id),0) as amountPurchased, IF(qt.status = 4,COUNT(it.id),0) as amountFinished
            FROM api.item it 
            LEFT JOIN api.quotation qt ON it.id = qt.id_item
            `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    insert(car) {
        try {
            const sql = `INSERT INTO car (id, cartype, brand, model, plate, color, year, chassis, fuel, departament, dateReg)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour  )`

            return query(sql, car)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async update(plate, status) {
        try {
            const sql = `UPDATE api.car SET status = ? where plate = ?`
            const data = await query(sql, [status, plate])

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    updateObs(id, obs) {
        try {
            const sql = `UPDATE api.car SET obs = ? where id = ?`
            return query(sql, [obs, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    cars(date) {

        try {
            if (date) {
                let sql = `SELECT ca.id as id_car, ca.plate, ca.obs, ca.thirst, dr.name as driver, tr.route, ca.brand, ca.model, ca.cartype, ca.color, ca.fuel, ca.departament, ca.chassis, ca.status as statuscar, DATE_FORMAT(ca.year, '%Y') as year, DATE_FORMAT(ca.dateReg, '%H:%i %d/%m/%Y') as date , tr.dateReg
                FROM api.car ca
                LEFT JOIN api.travelcar tc ON ca.id = tc.id_car
                LEFT JOIN api.travel tr ON tc.id_travel = tr.id 
                LEFT JOIN api.driver dr ON tr.id_driver = dr.id
                GROUP BY ca.plate
                ORDER BY ca.status DESC`
                return query(sql)

            } else {
                let sql = `SELECT *, DATE_FORMAT(year, '%Y') as year, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as date FROM api.car `
                return query(sql)
            }

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Car()