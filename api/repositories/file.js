const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class File {
    async insert(file, details, id_login) {
        try {
            const sql = `INSERT INTO api.file (filename, mimetype, path, size, ${details.name}, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )`
            await query(sql, [file.key, file.mimetype, file.location, file.size, details.code, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    async insertArchive(file, details, id_login) {
        try {
            const sql = `INSERT INTO api.file (filename, name, description, type, download, mimetype, path, size, id_login, datereg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour )`
            await query(sql, [file.key, details.name, details.description, details.type, details.download, file.mimetype, file.location, file.size, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    list(type, id) {
        try {
            let sql = `SELECT id, name, type, download, filename, path, mimetype, size, id_login, IFNULL(description, "No hay descripción") as description, DATE_FORMAT(datereg, '%H:%i %d/%m/%Y') as date from api.file `

            if (type && type == 5) {
                sql += `WHERE id_patrimony is null AND id_quotation is null AND id_item is null`
            } else {
                sql += `WHERE (${type} <> 0 || null) `
            }

            if (id) sql += `AND ${type} = ${id}`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    delete(key) {
        try {
            const sql = `DELETE from api.file WHERE filename = ?`

            return query(sql, key)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    update(file, id) {
        try {
            const sql = `UPDATE api.file SET description = ? WHERE id = ?`

            return query(sql, [file.description, id])
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }

    async view(key) {
        try {
            const sql = `SELECT * FROM file where key = ${key}`
            const result = await query(sql)

            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del archivo')
        }
    }
}

module.exports = new File()