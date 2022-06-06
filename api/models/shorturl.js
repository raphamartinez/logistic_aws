const Repositorie = require('../repositories/shorturl')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const crypto = require('crypto');

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
        const token = `https://sistema.olla.com.py/e/${crypto.randomBytes(3).toString('hex')}`
        page.token = token
        await Repositorie.insert(page)
        return token
    }

    update(page, id) {
        return Repositorie.update(page, id)
    }

    delete(id) {
        return Repositorie.delete(id)
    }
}

module.exports = new ShortUrl