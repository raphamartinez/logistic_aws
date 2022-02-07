const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class PowerBi {
    async insert(powerbi) {
        try {
            const sql = 'INSERT INTO api.report (url, title, type, description, dateReg) values (?, ?, ?, ?, now() - interval 3 hour )'
            const result = await query(sql, [powerbi.url, powerbi.title, powerbi.type, powerbi.description])

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('El powerbi no se pudo insertar en la base de datos')
        }
    }

    list(id_login, type) {
        try {
            let sql = `SELECT rp.id, rp.title, rp.description,  rp.url, 
            CASE
            WHEN rp.type = 1 THEN "Ingresos"
            WHEN rp.type = 2 THEN "Despesas Totales"
            WHEN rp.type = 3 THEN "Combustibles"
            WHEN rp.type = 4 THEN "Analisis de Resultados"
            WHEN rp.type = 5 THEN "Viajes y Choferes"
            WHEN rp.type = 6 THEN "Suprimentos"
            WHEN rp.type = 7 THEN "Compras"
            WHEN rp.type = 8 THEN "Plano de Cuentas"
            WHEN rp.type = 9 THEN "Rastreo y Telemetria"
            ELSE "Usuario"
            END as typedesc,
            rp.type, rp.token, rp.idreport, DATE_FORMAT(rp.dateReg, '%H:%i %d/%m/%Y') as dateReg,
            count(rv.id_report) as count 
            FROM api.report rp
            LEFT JOIN api.reportview rv ON rp.id = rv.id_report
            WHERE rp.type != 0 `

            if(id_login) sql += ` AND rv.id_login = ${id_login} `
            if(type) sql += ` AND rp.type = ${type} `

            sql+= ` GROUP BY rp.id
            ORDER BY rp.title ASC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    listLogin(id_login, type) {
        try {
            const sql = `SELECT rp.id, rp.title, rp.url, rp.type as typedesc, rp.type, rp.token, rp.idreport, DATE_FORMAT(rp.dateReg, '%H:%i %d/%m/%Y') as dateReg 
            FROM api.report rp 
            INNER JOIN api.reportview rv ON rp.id = rv.id_report
            WHERE rv.id_login = ? `

            return query(sql, id_login)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    listBis() {
        try {
            const sql = `SELECT rp.id, rp.type, rp.type as typedesc, rp.title, rp.description, rp.url, DATE_FORMAT(rp.dateReg, '%H:%i %d/%m/%Y') as dateReg, 
            count(rv.id_powerbi) as count
            FROM api.report rp 
            LEFT JOIN api.reportview rv ON rp.id = rv.id_report
            group by rp.id 
            ORDER BY rp.dateReg DESC`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('El powerbi no pudo aparecer en la lista')
        }
    }

    async delete(id) {
        try {

            const sqlView = `DELETE from api.reportview WHERE id_report = ?`
            await query(sqlView, id)

            const sql = `DELETE from api.report WHERE id = ?`
            await query(sql, id)

            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi en la base de datos')
        }
    }

    async count(id_login) {
        try {

            const sql = `SELECT COUNT(id) as count FROM api.reportview WHERE id_login = ?`
            const result = await query(sql, id_login)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se puede enumerar el número de powerbi')
        }
    }

    async update(powerbi, id) {
        try {
            const sql = 'UPDATE api.report SET url = ?, type = ?, title = ?, token = ?, idreport = ? WHERE id = ?'
            const result = await query(sql, [powerbi.url, powerbi.type, powerbi.title, powerbi.token, powerbi.idreport, id])
            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_powerbi) {
        try {
            const sql = `SELECT id, url, type, token, idreport, dateReg FROM api.report WHERE id = ?`
            const result = await query(sql, id_powerbi)
            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del powerbi')
        }
    }
}

module.exports = new PowerBi()