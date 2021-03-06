const Repositorie = require('../repositories/stock')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Stock {

    async insert(data) {
        try {
            await Repositorie.insert(data)

            return true
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

module.exports = new Stock