const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Quotation {

    async insert(id_item, item) {
        try {
            const sql = 'INSERT INTO api.quotation (id_item, id_provider, status, currency, price, amount, dateReg) values ( ?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            await query(sql, [id_item, item.provider, item.status, item.currency, item.price, item.amount])

            const sqlId = 'select LAST_INSERT_ID() as id from api.quotation LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            throw new InvalidArgumentError('Error')
        }
    }

    async update(item, id) {
        try {
            const sql = 'UPDATE api.quotation SET id_provider = ?, price = ?, amount = ? WHERE id = ?'
            const result = await query(sql, [item.provider, item.price, item.amount, id])

            return result
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Error')
        }
    }

    async check(id) {
        try {
            const sql = 'SELECT id from api.quotation WHERE id_item = ?'
            const result = await query(sql, id)

            return result[0]
        } catch (error) {
            console.log(error);
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

    delete(id) {
        try {
            const sql = `UPDATE api.quotation set status = ? WHERE id_item = ?`

            return query(sql, [7, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Quotation()