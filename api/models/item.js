const RepositorieItem = require('../repositories/item')
const RepositorieQuotation = require('../repositories/quotation')
const RepositorieCar = require('../repositories/car')
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

    async view(id) {
        try {
            const data = await RepositorieItem.view(id)

            return data

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
            throw new InternalServerError('Error.')
        }
    }

    async update(files, item, id_login) {
        try {
            if (item.type === '1') item.status = 1
            await RepositorieItem.update(item)

            if (files.file !== undefined) {
                for (const file of files.file) {
                    await File.save(file, { code: item.id, name: 'id_item' }, id_login)
                }
            }

            if (item.provider) {
                const obj = await RepositorieQuotation.check(item.id)
                if (obj) {
                    await RepositorieQuotation.update(item, obj.id)
                    item.id_quotation = obj.id
                } else {
                    const newid = await RepositorieQuotation.insert(item.id, item)
                    item.id_quotation = newid
                }

                if (files.voucher.length > 0) await File.save(files.voucher[0], { code: item.id_quotation, name: 'id_quotation' }, id_login)
            }

            return true
        } catch (error) {
            throw new InternalServerError(error)
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