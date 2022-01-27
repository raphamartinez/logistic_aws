const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ViewPowerBi {
    async insert(viewpowerbi) {
        try {
            const sql = 'INSERT INTO api.reportview (id_report, id_login, dateReg) values (?, ?, now() - interval 3 hour )';
            const result = await query(sql, [viewpowerbi.id_powerbi, viewpowerbi.id_login]);
            
            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo powerbi el archivo office en la base de datos')
        }
    }

    list(id_powerbi) {
        try {
            let sql = `SELECT rv.id as id_viewpowerbi, us.name, rv.id_login
            FROM api.reportview rv
            INNER JOIN api.user us ON rv.id_login = us.id_login 
            WHERE rv.id_report = ?
            GROUP BY rv.id
            ORDER BY rv.dateReg DESC`

            return query(sql, id_powerbi)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi')
        }
    }

    async delete(id_viewpowerbi) {
        try {
            const sql = `DELETE from api.reportview WHERE id = ?`
            const result = await query(sql, id_viewpowerbi)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi en la base de datos')
        }
    }
}

module.exports = new ViewPowerBi()