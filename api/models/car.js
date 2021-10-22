const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const xlsx = require('read-excel-file/node')
const Repositorie = require('../repositories/car')

class Car {

    dashboard() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    update(plate, status) {
        try {
            return Repositorie.update(plate, status)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    } 

    updateObs(id, obs){
        try {
            return Repositorie.updateObs(id, obs)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    liststatus() {
        try {
            return Repositorie.liststatus()
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async list(date) {
        try {
            // const filePath = `Vehiculos.xlsx`

            // const data = await xlsx(filePath).then((rows) => {
            //     return rows
            // })

            // data.shift()
            // data.forEach(car => {
            //     car[6] = `${car[6]}-01-01`
            //     Repositorie.insert(car)
            // })

            const data = await Repositorie.cars(date)

            return data

        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Car