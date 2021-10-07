const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Quotation {

    async insert(id_item, item) {
        try {
            const sql = 'INSERT INTO api.quotation (id_item, id_provider, status, price, amount, dateReg) values ( ?, ?, ?, ?, ?, now() - interval 4 hour )'
            await query(sql, [id_item, item.provider, item.status, item.price, item.amount])

            const sqlId = 'select LAST_INSERT_ID() as id from api.quotation LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async update(quotation) {
        try {
            const sql = 'UPDATE api.quotation SET ? WHERE id = ?'
            const result = await query(sql, [quotation.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    list() {
        try {
            const sql = `SELECT concat(qt.id, "-", it.code) as id, it.plate as chapa, it.code as cod_pieza, it.name as pieza, pr.name as proveedor, it.brand, qt.price as valor, it.description as obs, concat("./uploads/", vo.filename) as foto_presupuesto
            FROM api.item it 
            CROSS JOIN api.quotation qt ON it.id = qt.id_item
            INNER JOIN api.provider pr ON qt.id_provider = pr.id
            INNER JOIN api.voucher vo ON qt.id = vo.id_quotation
            GROUP BY qt.id
            ORDER BY plate`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    delete(quotation) {
        try {
            const sql = `DELETE FROM api.quotation WHERE id = ?`

            return query(sql, quotation.id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Quotation()