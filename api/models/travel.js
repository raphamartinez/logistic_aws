const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/travel')

class Travel {

    view(id_travel){
        try {
            return Repositorie.view(id_travel)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }


    async list(date, period, id_login) {
        try {
            const dateSQL = new Date(date)
            let firstdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate() }`
            let lastdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate() } 23:59:59`

            let travels = await Repositorie.list(firstdate, lastdate, period, id_login)

            let data = []
            for (let travel of travels) {
                let cars = await Repositorie.listPlates(travel.id)
                travel.cars = cars

                if (travel.cars && travel.cars.length == 2) {
                    travel.capacity = travel.cars[1].capacity
                } else {
                    travel.capacity = travel.cars[0].capacity
                }

                data.push(travel)
            }

            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async history(id) {
        try {
            let history = await Repositorie.history(id)

            return history
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async listPeriodCar(date, period, places) {
        try {
            const dateSQL = new Date(date)
            let firstdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate()}`
            let lastdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate()} 23:59:59`

            return Repositorie.listPeriodCar(firstdate, lastdate, period, places)

        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async insert(travel, id_login) {
        try {
            const id = await Repositorie.insert(travel, id_login)

            await Repositorie.insertCar(travel.plate, id, 1)

            if (travel.chest) await Repositorie.insertCar(travel.chest, id, 2)

            return id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Error.')
        }
    }

    async delete(id) {
        try {
            return Repositorie.delete(id)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Travel