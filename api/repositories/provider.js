const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Provider {

    async insert(provider) {
        try {
            const sql = 'INSERT INTO api.provider (name, RUC, phone, salesman, mail, address, dateReg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [provider.name, provider.ruc, provider.phone, provider.salesman, provider.mail, provider.address])

            
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
            const sql = 'UPDATE api.provider SET RUC = ?, phone = ?, salesman = ? WHERE id = ?'
            const result = await query(sql, [provider.ruc, provider.phone, provider.salesman, provider.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    list() {
        try {
            const sql = `SELECT id, name, RUC as ruc, phone, salesman, address, mail, DATE_FORMAT(dateReg, '%H:%i %d/%m/%Y') as dateReg FROM api.provider `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    delete(provider) {
        try {
            const sql = `DELETE FROM api.provider WHERE id = ?`

            return query(sql, provider.id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Provider()