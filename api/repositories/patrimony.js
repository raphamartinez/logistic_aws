const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Patrimony {

    async insert(item, id_login) {
        try {
            const sql = 'INSERT INTO api.patrimony (id_login, local, code, name, dateReg) values (?, ?, ?, ?, now() - interval 4 hour)'
            await query(sql, [id_login, item.local, item.code, item.name])

            const sqlId = 'select LAST_INSERT_ID() as id from api.patrimony LIMIT 1'
            const obj = await query(sqlId)
            return obj[0].id
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el articulo en la base de datos')
        }
    }

    async update(patrimony) {

        try {
            const sql = 'UPDATE api.patrimony SET name = ?, local = ? WHERE id = ?'
            const result = await query(sql, [patrimony.name, patrimony.local, patrimony.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    list() {
        try {
            let sql = `SELECT  pa.id, pa.code, pa.name, pa.id_login, DATE_FORMAT(pa.datereg, '%H:%i %d/%m/%Y') as date ,
            CASE
                WHEN pa.local = 1 THEN "KM 1"
                WHEN pa.local = 2 THEN "KM 28"
                WHEN pa.local = 3 THEN "YPANÉ"
                WHEN pa.local = 4 THEN "AC. KM 1"
                WHEN pa.local = 5 THEN "LOG. HERRAMIENTAS"
                WHEN pa.local = 6 THEN "LOG. VEHÍCULOS"
                WHEN pa.local = 7 THEN "LOG. EQUIPOS"
                ELSE "Ninguno local definido."
            END as local, pa.local as localcode
            FROM api.patrimony pa`

           return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async last(id) {
        try {
            let sql = `SELECT MAX(pa.code) as code
            FROM api.patrimony pa
            WHERE pa.local = ? `

           const result = await query(sql, id)

           return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    delete(id) {
        try {
            const sql = `DELETE FROM api.patrimony WHERE id = ?`

            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Patrimony()