const Repositorie = require('../repositories/user')
const RepositorieLogin = require('../repositories/login')
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
                console.log(id_login);

                const obj = {
                    name: user.name,
                    profile: user.profile,
                    mail: user.mail,
                    login: {
                        id_login: id_login
                    }
                }

                let id_user = await Repositorie.insert(obj)

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
            console.log(id);
            const status = 0
            await Repositorie.delete(status, id)

            return true
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el usuario.')
        }
    }

    async update(user, id) {
        try {
            console.log(user);
            console.log(id);
            await Repositorie.update(user, id)
            await RepositorieLogin.update(user, id)

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el usuario.')
        }
    }

    async list() {
        try {
            let status = 1
            return Repositorie.list(status)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los usuarios.')
        }
    }
}

module.exports = new User