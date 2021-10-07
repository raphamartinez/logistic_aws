const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class PatrimonyImage {
    async insert(file, id_patrimony, id_login) {
        try {
            if(file.path) file.location = `${process.env.BASE_URL}/files/${file.path}`

            const sql = 'INSERT INTO api.patrimonyImage (filename, mimetype, location, size, id_patrimony, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            await query(sql, [file.key, file.mimetype, file.location, file.size, id_patrimony, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    delete(key) {
        try {
            const sql = `DELETE from api.patrimonyImage WHERE key = ${key}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }
}

module.exports = new PatrimonyImage()