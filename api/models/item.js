const RepositorieItem = require('../repositories/item')
const RepositorieQuotation = require('../repositories/quotation')
const RepositorieCar =require('../repositories/car')
const File = require('./file')
const Quotation = require('./quotation')
const cachelist = require('../infrastructure/redis/cache')
const xlsx = require('read-excel-file/node')

const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const { ImATeapot } = require('http-errors')

class Item {

    async insert(files, item, id_login) {
        try {
            if (item.type > 0) item.status = 1
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

    async list(plate, status) {
        try {
            const data = await RepositorieItem.list(plate, status)

            const cars = await RepositorieCar.cars()

            data.forEach(obj => {
                let car = cars.find(dt => dt.plate === obj.plate)
                obj.car = `${car.plate} - ${car.cartype} - ${car.brand} - ${car.model} - ${car.year}`
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