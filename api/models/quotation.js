const Repositorie = require('../repositories/quotation')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Quotation {

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

module.exports = new Quotation