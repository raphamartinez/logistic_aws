const RepositorieItem = require('../repositories/item')
const RepositorieQuotation = require('../repositories/quotation')
const File = require('./file')
const Quotation = require('./quotation')
const cachelist = require('../infrastructure/redis/cache')
const xlsx = require('read-excel-file/node')

const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Item {

    async insert(files, item, id_login) {
        try {

            const id_item = await RepositorieItem.insert(item)

            for (const file of files.file) {
                await File.save(file, { code: id_item, name: 'id_item' }, id_login)
            }

            if (item.provider) {
                const id_quotation = await RepositorieQuotation.insert(id_item, item)

                if (files.voucher.length > 0) await File.save(files.voucher[0], { code: id_quotation, name: 'id_quotation' }, id_login)
            }

            return id_item
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    async list(plate) {
        try {
            const data = await RepositorieItem.list(plate)

            let cars

            const filePath = `Vehiculos.xlsx`

            cars = await xlsx(filePath).then((rows) => {
                return rows
            })

            cars.shift()

            data.forEach(obj => {
                let car = cars.find(dt => dt[4] === obj.plate)
                obj.car = `${car[4]} - ${car[1]} - ${car[2]} - ${car[3]} - ${car[6]}`
            })

            return data

        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async update(item, id) {
        try {
            await RepositorieItem.update(item, id)
            await RepositorieQuotation.update(item, id)

            return true
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    async delete(id) {
        try {
            await Quotation.delete(id)

            return RepositorieItem.delete(id)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Item