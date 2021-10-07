const RepositorieItem = require('../repositories/item')
const RepositorieFile = require('../repositories/file')
const RepositorieVoucher = require('../repositories/voucher')
const RepositorieQuotation = require('../repositories/quotation')
const cachelist = require('../infrastructure/redis/cache')
const xlsx = require('read-excel-file/node')

const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Item {

    async insert(files, item, id_login) {
        try {

            const id_item = await RepositorieItem.insert(item)
            const id_quotation = await RepositorieQuotation.insert(id_item, item)

            for (const file of files.file) {
                await RepositorieFile.insert(file, id_item, id_login)
            }

            if (files.voucher.length > 0) await RepositorieVoucher.insert(files.voucher[0], id_quotation, id_login)

            return true
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    async list(plate) {
        try {
            const data = await RepositorieItem.list(plate)

            const filePath = `Vehiculos.xlsx`

            let cars = await xlsx(filePath).then((rows) => {
                return rows
            })

            cars.shift()

            data.forEach(obj => {
                let car = cars.find(dt => dt[4] === obj.plate)
                console.log(cars);
                obj.car = `${car[4]} - ${car[1]} - ${car[2]} - ${car[3]} - ${car[6]}`
            })

            return data

        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async update(data, id) {
        try {
            await RepositorieItem.update(data, id)
            await RepositorieQuotation.update(data, id)

            return true

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    delete(key) {
        try {
            return RepositorieItem.delete(key)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Item