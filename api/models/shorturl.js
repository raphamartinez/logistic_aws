const Repositorie = require('../repositories/shorturl')
const bcrypt = require('bcrypt')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class ShortUrl {

    async verify(token) {
        const result = {
            url: false,
            msg: 'Página no encontrada',
            error: '404'
        }
        const page = await Repositorie.verify(token)
        if(!page){
            return result
        }
        if (!isNaN(page.expiration)) {
            const now = new Date()
            const expiration = new Date(page.expiration)
            if (expiration.getTime() < now.getTime()){
                const result = {
                    url: false,
                    msg: 'El enlace esta caducado',
                    error: '403'
                }
                return result
            } 
        }
        return page
    }

    list() {
        return Repositorie.list()
    }

    async insert(page) {
        const date = new Date()
        const token = await bcrypt.hash(`${date.getTime()}`, 10)
        page.token = token.replace('/', '-')
        return Repositorie.insert(page)
    }

    update(page, id) {
        return Repositorie.update(page, id)
    }

    delete(id) {
        return Repositorie.delete(id)
    }
}

module.exports = new ShortUrl