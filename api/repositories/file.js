const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class File {
    async insert(file, details, id_login) {
        try {
            if (file.name) file.key = file.name
            if (!file.location) file.location = `${process.env.BASE_URL}/files/${file.key}`

            file.size = file.size / 1024 / 1024

            const sql = `INSERT INTO api.file (filename, mimetype, path, size, ${details.name}, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )`
            await query(sql, [file.key, file.mimetype, file.location, file.size, details.code, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    list(type, id) {
        try {
            let sql = `SELECT id, filename, path, mimetype, size, id_login, IFNULL(description, "No hay descripción") as description, DATE_FORMAT(datereg, '%H:%i %d/%m/%Y') as date from api.file `

            if (type) sql += `WHERE (${type} <> 0 || null) `

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