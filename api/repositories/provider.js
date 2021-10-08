const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Provider {

    async insert(provider) {
        try {
            const sql = 'INSERT INTO api.provider (name, RUC, phone, salesman, mail, address, status, dateReg) values (?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [provider.name, provider.ruc, provider.phone, provider.salesman, provider.mail, provider.address, 1])


            const sqlId = 'select LAST_INSERT_ID() as id from api.provider LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Error')
        }
    }

    async update(provider) {

        try {
            const sql = 'UPDATE api.provider SET name = ?, RUC = ?, phone = ?, salesman = ?, mail = ?, address = ? WHERE id = ?'
            const result = await query(sql, [provider.name, provider.ruc, provider.phone, provider.salesman, provider.mail, provider.address, provider.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    list() {
        try {
            const sql = `SELECT id, name, RUC as ruc, phone, salesman, address, mail, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM api.provider 
            WHERE status = 1`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    delete(id) {
        try {
            const sql = `UPDATE api.provider set status = ? WHERE id = ?`

            return query(sql, [0, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Provider()