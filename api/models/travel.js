const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/travel')

class Travel {


    async list(date, period) {
        try {
            let travels = await Repositorie.list(date, period)

            let data = []
            for(let travel of travels){
                let cars = await Repositorie.listPlates(travel.id)
                travel.cars = cars

                data.push(travel)
            }

            return data
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