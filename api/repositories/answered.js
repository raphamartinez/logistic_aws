const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Answered {

    async insert(response) {
        try {
            const sql = 'INSERT INTO answeredinterview (id_interview, id_question, id_answer, value) values (?, ?, ?, ?)'
            await query(sql, [response.id_interview, response.id_question, response.id_answer, response.value])
            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo insertar la sucursal en la base de datos')
        }
    }

    async delete(id) {
        try {
            const sql = `DELETE from answeredinterview WHERE id = ${id}`
            const result = await query(sql)
            return result[0]
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    async check(response){
        try {
            let sql = `SELECT id from answeredinterview 
            WHERE id_interview = ?
            and id_question = ? `

            if(response.id_answer) sql += ` and id_answer = '${response.id_answer}'`

            const result = await query(sql, [response.id_interview, response.id_question])
            return result[0]
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se puede eliminar la sucursal en la base de datos')
        }
    }

    async update(response) {
        try {
            const sql = 'UPDATE answeredinterview SET value = ?  WHERE id = ?'
            const result = await query(sql, [response.value, response.id])
            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('Error al actualizar los datos')
        }
    }
}

module.exports = new Answered()