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

    async update(item) {
        try {
            const sql = 'UPDATE api.item SET code = ? name = ? local = ? WHERE id = ?'
            const result = await query(sql, [item.code, item.name, item.local, item.id])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    list() {
        try {
            let sql = `SELECT pi.filename, pa.code, pa.name, pa.local, pi.size, pi.location, pi.mimetype, pa.id_login, DATE_FORMAT(pa.datereg, '%H:%i %d/%m/%Y') as date 
            FROM api.patrimony pa
            LEFT JOIN api.patrimonyImage pi ON pa.id = pi.id_patrimony `

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

    delete(item) {
        try {
            const sql = `DELETE FROM api.patrimony WHERE id = ?`

            return query(sql, item.id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new Patrimony()