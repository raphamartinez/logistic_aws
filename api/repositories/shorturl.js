const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class ShortUrl {
    async insert(page) {
        try {
            const sql = 'INSERT INTO api.shorturl (url, title, authenticate, expiration, token, datereg) values (?, ?, ?, ?, ?, now() - interval 3 hour )';
            const result = await query(sql, [page.url, page.title, page.authenticate, page.expiration, page.token]);

            return result.insertId;
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingressar en la base de datos')
        }
    }

    async verify(token) {
        try {
            const sql = `SELECT * FROM api.shorturl WHERE token = ?`
            const result = await query(sql, token)
            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los token')
        }
    }

    list() {
        try {
            let sql = `SELECT id, url, title, token, authenticate, DATE_FORMAT(expiration, '%Y-%m-%dT%H:%i') as expiration FROM api.shorturl`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los token')
        }
    }

    update(page, id) {
        try {
            let sql = `UPDATE api.shorturl SET url = ?, title = ?, expiration = ?, authenticate = ? WHERE id = ?`
            return query(sql, [page.url, page.title, page.expiration, page.authenticate, id])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los token')
        }
    }

    delete(id) {
        try {
            let sql = `DELETE FROM api.shorturl WHERE id = ?`
            return query(sql, id)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los token')
        }
    }
}

module.exports = new ShortUrl()