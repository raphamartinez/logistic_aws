const Repositorie = require('../repositories/user')
const RepositorieLogin = require('../repositories/login')
const RepositoriePlace = require('../repositories/place')

const bcrypt = require('bcrypt')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class User {

    static generatePasswordHash(password) {
        const costHash = 12
        return bcrypt.hash(password, costHash)
    }

    async insert(user) {
        try {
            const costHash = 12
            const password = await bcrypt.hash(user.pass, costHash)

            const check = await RepositorieLogin.checkAccess(user.access)
            let result = {}

            if (!check) {
                const login = {
                    access: user.access,
                    password: password,
                    mailVerify: 1,
                    status: 1
                }

                let id_login = await RepositorieLogin.insert(login)

                const obj = {
                    name: user.name,
                    profile: user.profile,
                    mail: user.mail,
                    login: {
                        id_login: id_login
                    }
                }

                let id_user = await Repositorie.insert(obj)

                if (user.places && user.places.length > 0 && user.profile != 4) {
                    for (let place of user.places) {
                        RepositoriePlace.insert(place, id_login)
                    }
                }

                result.id_user = id_user
                result.id_login = id_login

                return result
            } else {
                throw new InvalidArgumentError('Ya existe un usuario con este acceso, cámbielo.')
            }
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo registrar un nuevo usuario.')
        }
    }

    async delete(id) {
        try {
            const status = 0
            await Repositorie.delete(status, id)

            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario.')
        }
    }

    async update(user, id) {
        try {

            await Repositorie.update(user, id)
            await RepositorieLogin.update(user, id)
            
            if(user.places && user.places.length > 0){
                await RepositoriePlace.drop(id)

                for(let place of user.places){
                  if(place != "" && place != 0 && place)  await RepositoriePlace.insert(place, id)
                }
            }

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el usuario.')
        }
    }

    async list() {
        try {
            let status = 1
            const users = await Repositorie.list(status)

            for (let user of users) {
                const placesList = await RepositoriePlace.list(user.id_login)

                const places = Array.from(placesList).map(e => e.value)
                user.places = places
            }

            return users
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios.')
        }
    }
}

module.exports = new User