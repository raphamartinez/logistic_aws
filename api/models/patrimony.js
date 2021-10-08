const Repositorie = require('../repositories/patrimony')
const File = require('./file')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Patrimony {

    async insert(files, details, id_login) {
        try {
            const id_patrimony = await Repositorie.insert(details, id_login)

            for (const file of files) {
                await File.save(file, { code: id_patrimony, name: 'id_patrimony' }, id_login)
            }

            return id_patrimony
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }

    async delete(id) {
        try {
            const type = "id_patrimony"
            const files = await File.list(type)

            if (files) {
                await files.forEach(async file => {
                    await File.delete(file.filename)
                })
            }

            await Repositorie.delete(id)

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
        }
    }

    
    update(patrimony) {
        try {
            return Repositorie.update(patrimony)
        } catch (error) {
            throw new InternalServerError('Error al actualizar el proveedor.')
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