const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Car {

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

    cars(car){
        try {
            let sql = `SELECT *, DATE_FORMAT(year, '%Y') as year, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as date FROM api.car `

            if(car) sql =+ `WHERE plate = '${car}'`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Car()