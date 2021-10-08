const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class File {
    async insert(file, id, id_login) {
        try {
            if (file.name) file.key = file.name
            if (!file.location) file.location = `${process.env.BASE_URL}/files/${file.key}`

            const sql = `INSERT INTO api.file (filename, mimetype, path, size, ${id.name}, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )`
            await query(sql, [file.key, file.mimetype, file.location, file.size, id.code, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    list(type) {
        try {
            let sql = `SELECT filename, path, mimetype, size, id_login, description, datereg from api.file `

            if (type) sql += `WHERE (${type} <> 0 || null)`

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