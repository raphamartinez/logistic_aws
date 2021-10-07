const RepositorieItem = require('../repositories/item')
const RepositorieFile = require('../repositories/file')
const RepositorieVoucher = require('../repositories/voucher')
const RepositorieQuotation = require('../repositories/quotation')

const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Item {

    async insert(files, item, id_login) {
        try {

            const id_item = await RepositorieItem.insert(item)
            const id_quotation = await RepositorieQuotation.insert(id_item, item)

            for (const file of files.file) {
                await RepositorieFile.insert(file, id_item, id_login)
            }

            if(files.voucher.length > 0) await RepositorieVoucher.insert(files.voucher[0], id_quotation, id_login)

            return true
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    list(plate) {
        try {
            return RepositorieItem.list(plate)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    update(data, id) {
        try {
            return RepositorieItem.update(data, id)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    delete(id) {
        try {
            return RepositorieItem.delete(id)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Item