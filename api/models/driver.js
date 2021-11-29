const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/driver')

class Driver {

    insert(driver) {
        try {
            return Repositorie.insert(driver)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async list(places) {
        try {
            return Repositorie.list(places)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

   async listPeriodDriver(date, period) {
        try {
            const dateSQL = new Date(date)

            let firstdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate() }`
            let lastdate = `${dateSQL.getFullYear()}-${dateSQL.getMonth() + 1}-${dateSQL.getDate() } 23:59:59`

            const data = await Repositorie.listPeriodDriver(firstdate, lastdate, period)

            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    update(id, status) {
        try {
            return Repositorie.update(id, status)
        } catch (error) {
            throw new InternalServerError('Error.')
        }
    } 

    updateDriver(id, driver) {
        try {
            return Repositorie.updateDriver(id, driver)
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

    // async list() {
    //     try {
    //         const filePath = `Choferes.xlsx`

    //         const data = await xlsx(filePath).then((rows) => {
    //             return rows
    //         })

    //         data.shift()
    //         data.forEach(async car => {
    //             await Repositorie.insert(car)
    //         })            

    //     } catch (error) {
    //         console.log(error);
    //         throw new InternalServerError('Error.')
    //     }
    // }
}

module.exports = new Driver