const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class User {
    async insert(user) {
        try {
            const sql = `INSERT INTO api.user (name, profile, mail, dateReg, id_login) values (?, ?, ?, now() - interval 3 hour , ?)`
            const result = await query(sql, [user.name, user.profile, user.mail, user.login.id_login])

            return result.insertId
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar el usuario en la base de datos')
        }
    }

    async delete(status, id) {
        try {
            const sql = `UPDATE api.login set status = ? WHERE id = ?`
            await query(sql, [status, id])

            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario en la base de datos')
        }
    }

    async update(user, id) {
        try {
            const sql = 'UPDATE api.user SET name = ?, profile = ?, mail = ? WHERE id_login = ?'
            await query(sql, [user.name, user.profile, user.mail, id])

            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    list(status) {
        try {
            const sql = `SELECT us.id, us.id_login, us.name, us.mail, us.profile, lo.access, DATE_FORMAT(us.dateReg, '%H:%i %d/%m/%Y') as dateReg,
            CASE
                WHEN us.profile = 1 THEN "Mantenimiento"
                WHEN us.profile = 2 THEN "Patrimonio"
                WHEN us.profile = 3 THEN "Vehículo"
                WHEN us.profile = 4 THEN "Admin"
                ELSE "Usuario"
                END as profiledesc
            FROM api.user us
            INNER JOIN api.login lo ON us.id_login = lo.id
            WHERE lo.status = ?`

            return query(sql, status)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios')
        }
    }
}

module.exports = new User()