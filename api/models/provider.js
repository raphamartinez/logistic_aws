const Repositorie = require('../repositories/provider')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Provider {

    async insert(data) {
        try {
            const id = await Repositorie.insert(data)

            return id
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    list() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    update(data, id) {
        try {
            return Repositorie.update(data, id)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    delete(id) {
        try {
            return Repositorie.delete(id)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Provider