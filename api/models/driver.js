const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/driver')

class Driver {


    async list() {
        try {
            return Repositorie.list()
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