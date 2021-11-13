const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Login {

    async insert(login) {
        try {
            const sql = 'INSERT INTO login (access, password, mailVerify, status, dateReg ) values (?, ?, ?, ?, now() - interval 3 hour )'
            const result = await query(sql, [login.access, login.password, login.mailVerify, login.status])

            return result.insertId
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async delete(id_login) {
        try {
            const sql = `DELETE from login WHERE id_login = ${id_login}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el login en la base de datos')
        }
    }

    async update(user, id) {
        try {
            const sql = 'UPDATE login SET access = ? WHERE id = ?'
            await query(sql, [user.access, id])
            return true
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }

    }

    async updatePassword(password, id_login) {
        try {
            const sql = 'UPDATE login SET password = ? WHERE id_login = ?'
            await query(sql, [password, id_login])
            return 'Contraseña actualizada exitosamente'
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }

    async view(id_login) {
        try {
            const sql = `SELECT us.name, us.profile, us.id_login 
            FROM api.user us
            INNER JOIN api.login lo ON us.id_login = lo.id 
            WHERE lo.id = ? and lo.status = 1`

            const result = await query(sql, id_login)

            if (!result) {
                throw new InvalidArgumentError(`El nombre de usuario o la contraseña no son válidos`)
            }

            return result[0]
        } catch (error) {
            throw new InternalServerError('Error en la vista previa del login')
        }
    }

    list() {
        try {
            const sql = 'SELECT * FROM login'
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async viewMail(access) {
        try {
            const sql = `SELECT lo.access, lo.password, lo.id FROM login lo, user us where lo.access = '${access}' and lo.status = 1 and us.id_login = lo.id`
            const result = await query(sql)

            if (!result[0]) {
                throw new InvalidArgumentError(`El nombre de usuario o la contraseña no son válidos`)
            }

            return result[0]
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

    async viewMailEnterprise(mailenterprise) {
        try {
            const sql = `SELECT lo.access, lo.password, lo.id_login FROM login lo, user us where lo.status = 1 and us.id_login = lo.id`
            const result = await query(sql)

            if (!result[0]) {
                return false
            }

            return result[0]
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

    async verifyMail(mail, id_login) {
        try {
            const sql = `UPDATE login SET mailVerify = ? WHERE id_login = ?`
            const result = await query(sql, [mail, id_login])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }


    async checkAccess(access) {
        try {
            const sql = `SELECT access FROM api.login WHERE access = ?`
            const result = await query(sql, access)

            return result[0]
        } catch (error) {
            throw new InternalServerError('El nombre de usuario o la contraseña no son válidos')
        }
    }

}

module.exports = new Login()