const Repositorie = require('../repositories/reportview')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class ViewPowerBi {

    async insertPowerBi(users, id) {
        try {
            let access = [];

            for (let user of users) {
                const viewpowerbi = {
                    id_powerbi: id,
                    id_login: user
                };

                let newId = await Repositorie.insert(viewpowerbi);
                viewpowerbi.id = newId;

                access.push(viewpowerbi)
            }

            return access;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el powerbi.')
        }
    }

    async insertPowerBis(powerbis, id_login) {
        try {

            powerbis.forEach(async obj => {
                const viewpowerbi = {
                    id_login: id_login,
                    id_powerbi: obj
                }

                Repositorie.insert(viewpowerbi)
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el powerbi.')
        }
    }

    async delete(id_viewpowerbi) {
        try {
            const result = await Repositorie.delete(id_viewpowerbi)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    listPowerBi(id_powerbi) {
        try {
            return Repositorie.list(id_powerbi)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi.')
        }
    }

}

module.exports = new ViewPowerBi