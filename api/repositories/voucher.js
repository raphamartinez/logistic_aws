const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Voucher {
    async insert(file, id_quotation, id_login) {
        try {
            if(file.path) file.location = `${process.env.BASE_URL}/files/${file.path}`

            const sql = 'INSERT INTO api.voucher (filename, mimetype, location, size, id_quotation, id_login, datereg) values (?, ?, ?, ?, ?, ?, now() - interval 4 hour )'
            await query(sql, [file.key, file.mimetype, file.location, file.size, id_quotation, id_login])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo insertar el archivo en la base de datos')
        }
    }

    delete(id_file) {
        try {
            const sql = `DELETE from api.voucher WHERE id = ${id_file}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el archivo en la base de datos')
        }
    }
    async view(id_file) {
        try {
            const sql = `SELECT * FROM voucher where id = ${id_file}`
            const result = await query(sql)

            return result[0]
        } catch (error) {
            throw new NotFound('Error en la vista previa del archivo')
        }
    }

    list(file) {
        try {
            let sql = `SELECT DATE_FORMAT(datereg, '%H:%i %d/%m/%Y') as datereg, location, size, id_login, mimetype, filename, id FROM file
            WHERE mimetype <> "" `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos')
        }
    }
}

module.exports = new Voucher()