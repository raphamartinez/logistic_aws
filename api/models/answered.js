const Repositorie = require('../repositories/answered')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Answered {

    async insert(response) {
        try {
            const check = await Repositorie.check(response)
            if (check){
                response.id = check.id
                await Repositorie.update(response)

                return { msg: 'Respuesta actualizada con éxito.' }
            }else{
                await Repositorie.insert(response)

                return { msg: 'Respuesta agregada con éxito.' }
            }
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
        }
    }

    async list() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }

    async delete(id) {
        try {
            return Repositorie.delete(id)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar la sucursal.')
        }
    }
}

module.exports = new Answered