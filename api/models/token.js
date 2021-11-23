const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')

const { InvalidArgumentError } = require('./error')

const allowlist = require('../infrastructure/redis/allowlist')
const blocklist = require('../infrastructure/redis/blocklist')
const resetPassword = require('../infrastructure/redis/resetpassword')

function createTokenJWT(id, [timeQty, timeUnit]) {
    const payload = { id }
    const token = jwt.sign(payload, process.env.KEY_JWT, {
        expiresIn: timeQty + timeUnit
    })
    return token
}

async function verifyTokenJWT(token, name, blocklist) {
    await verifyTokenBlocklist(token, name, blocklist)
    const { id } = jwt.verify(token, process.env.KEY_JWT)
    return id
}

async function verifyTokenBlocklist(token, name, blocklist) {
    if (!blocklist) {
        return
    }

    const tokenBlocklist = await blocklist.containsToken(token)
    if (tokenBlocklist) {
        throw new jwt.JsonWebTokenError(`${name} inválido por logout!`)
    }
}

function invalidTokenJWT(token, blocklist) {
    return blocklist.add(token)
}

async function createTokenOpaco(id, [timeQty, timeUnit], allowlist) {
    const tokenOpaco = crypto.randomBytes(24).toString('hex')
    const dateExp = moment().add(timeQty, timeUnit).unix()
    await allowlist.add(tokenOpaco, id, dateExp)
    return tokenOpaco
}

async function verifyTokenOpaco(token, name, allowlist) {
    verifyTokenSend(token, name)
    const id = await allowlist.searchValue(token)
    verifyTokenValid(id, name)
    return id
}

async function invalidTokenOpaco(token, allowlist) {
    await allowlist.delete(token)
}

function verifyTokenValid(id, name) {
    if (!id) {
        throw new InvalidArgumentError(`${name} invalid!`)
    }
}

function verifyTokenSend(token, name) {
    if (!token) {
        throw new InvalidArgumentError(`${name} not send!`)
    }
}

module.exports = {
    access: {
        name: 'access token',
        list: blocklist,
        dateExp: [45, 'm'],
        create(id) {
            return createTokenJWT(id, this.dateExp)
        },
        verify(token) {
            return verifyTokenJWT(token, this.name, this.list)
        },
        invalid(token) {
            return invalidTokenJWT(token, this.list)
        }
    },
    refresh: {
        name: 'refresh token',
        list: allowlist,
        dateExp: [4, 'h'],
        create(id) {
            return createTokenOpaco(id, this.dateExp, this.list)
        },
        verify(token) {
            return verifyTokenOpaco(token, this.name, this.list)
        },
        invalid(token) {
            return invalidTokenOpaco(token, this.list)
        }
    },
    verifyMail: {
        name: 'token de verificação de e-mail',
        dateExp: [1, 'd'],
        create(id) {
            return createTokenJWT(id, this.dateExp)
        },
        verify(token) {
            return verifyTokenJWT(token, this.name)
        }
    },
    verifyQuiz: {
        name: 'token de acesso ao questionário',
        list: blocklist,
        dateExp: [1, 'd'],
        create(id) {
            return createTokenJWT(id, this.dateExp)
        },
        verify(token) {
            return verifyTokenJWT(token, this.name)
        },
        invalid(token) {
            return invalidTokenJWT(token, this.list)
        }
    },
    resetPassword: {
        name: 'Redefinição de senha',
        list: resetPassword,
        dateExp: [24, 'h'],
        create(id) {
            return createTokenOpaco(id, this.dateExp, this.list)
        },
        verify(token) {
            return verifyTokenOpaco(token, this.name, this.list)
        },
    }
}
