const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Item {

    async insert(item) {
        try {
            const sql = 'INSERT INTO api.item (code, name, brand, plate, status, type, km, description, dateReg) values (?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [item.code, item.name, item.brand, item.plate, item.status, item.type, item.km, item.description])

            const sqlId = 'select LAST_INSERT_ID() as id from api.item LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el articulo en la base de datos')
        }
    }

    async update(item) {
        try {
            const sql = 'UPDATE api.item SET code = ?, name = ?, brand = ?, plate = ?, type = ?, km = ?, description = ? WHERE id = ?'
            const result = await query(sql, [item.code, item.name, item.brand, item.plate, item.type, item.km, item.description, item.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    list(plate, status) {
        try {
            let sql = `SELECT concat(pr.id, " - ", it.code) as idcode, it.code, it.id, it.name, it.brand, it.plate, DATE_FORMAT(it.dateReg, '%H:%i %d/%m/%Y') as date, if(it.type = 1, "Presupuesto", if(it.type = 2,"Stock","No definido")) as type, it.km, it.description,
            qt.currency, qt.price, qt.amount, qt.status, pr.name as provider, qt.id as id_quotation, it.status as itemstatus, qt.status as statusquotation
            FROM api.item it 
            LEFT JOIN api.quotation qt ON it.id = qt.id_item
            LEFT JOIN api.provider pr ON qt.id_provider = pr.id `

            if (plate) {
                sql += `
            WHERE it.plate = '${plate}'
            AND it.status <> 7
            ORDER BY it.id`
            } else {
                if (status){
                    sql += `
                    WHERE it.status = ${status}
                    ORDER BY it.id`
                }else{
                    sql += `
                    WHERE it.status <> 7
                    ORDER BY it.id`
                }
            }

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async view(id) {
        try {
            const sql = `SELECT concat(ca.plate, ' - ', ca.cartype, ' - ', ca.brand, ' - ', ca.model, ' - ', DATE_FORMAT(ca.year, '%Y')) as concatcar ,concat(pr.id, " - ", it.code) as idcode, it.code, it.id, it.name, it.brand, it.plate, DATE_FORMAT(it.dateReg, '%H:%i %d/%m/%Y') as date, if(it.type = 1, "Presupuesto", if(it.type = 2,"Stock","No definido")) as type, it.km, it.description,
            qt.currency, qt.price, qt.amount, qt.status, pr.name as provider, qt.id as id_quotation, it.status as itemstatus, qt.status as statusquotation
            FROM api.item it 
            INNER JOIN api.car ca ON it.plate = ca.plate
            LEFT JOIN api.quotation qt ON it.id = qt.id_item
            LEFT JOIN api.provider pr ON qt.id_provider = pr.id
            WHERE it.id = ?`

            const result = await query(sql, id)

            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    delete(id) {
        try {
            const sql = `UPDATE api.item set status = ? WHERE id = ?`

            return query(sql, [7, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Item()