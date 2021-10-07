const Repositorie = require('../repositories/patrimony')
const RepositorieImage = require('../repositories/patrimonyImage')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Patrimony {

    async insert(files, details, id_login) {
        try {
            const id_patrimony = await Repositorie.insert(details, id_login)

            for (const file of files) {
                await RepositorieImage.insert(file, id_patrimony, id_login)
            }

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }

    async delete(key) {
        try {
            await RepositorieImage.delete(key)

            return true
        } catch (error) {
            throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
        }
    }

    async list(local) {
        try {
            const data = await Repositorie.list(local)

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos.')
        }
    }

    async last(id) {
        try {
            const obj = await Repositorie.last(id)

            if (!obj.code) {
                obj.code = 1
            } else {
                obj.code++
            }

            return obj.code
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos.')
        }
    }
}

module.exports = new Patrimony