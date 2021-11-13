const passport = require('passport')
const Login = require('../../models/login')
const Token = require('../../models/token')
const Controll = require('./accesscontrol')

const method = {
  read: {
    all: 'readAny',
    only: 'readOwn'
  },
  create: {
    all: 'createAny',
    only: 'createOwn'
  },
  delete: {
    all: 'deleteAny',
    only: 'deleteOwn'
  }
}

module.exports = {

  local(req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      (error, login, info) => {
        if (error) {
          return next(error)
        }
        req.login = login
        req.authenticated = true
        return next()
      }
    )(req, res, next)
  },


  tryaAprove(req, res, next) {
    if (req.authenticated === true) {
      return tryAuthentic(req, res, next)
    }
    next()
  },

  tryAuthentic(req, res, next) {
    req.authenticated = false
    if (req.get('Authorization')) {
      return this.bearer(req, res, next)
    }
    next()
  },

  profile(req, res, next) {

    const permissionsProfile = Controll.can(req.user.profile)
    const actions = method[action]
    const permissionAll = permissionsProfile[actions.all](profile)
    const permissionOnly = permissionsProfile[actions.only](profile)

    if (permissionAll.granted === false && permissionOnly.granted === false) {
      res.status(403)
      res.end()
      return
    }

    req.access = {
      all: {
        allowed: permissionAll.granted,
        atributes: permissionAll.atributes
      },
      only: {
        allowed: permissionOnly.granted,
        atributes: permissionOnly.atributes
      }
    }

    next()
  },

  bearer(req, res, next) {
    passport.authenticate(
      'bearer',
      { session: false },
      (error, login, info) => {
        try {
          if (error) {
            return next(error)
          }
          req.token = info.token
          req.login = login
          req.authenticated = true
          return next()
        } catch (error) {
          return next(error)
        }
      }
    )(req, res, next)
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body
      const id_login = await Token.refresh.verify(refreshToken)
      await Token.refresh.invalid(refreshToken)
      req.login = await Login.viewLogin(id_login)
      return next()
    } catch (error) {
      if (error.name === 'InvalidArgumentError') {
        return res.status(401).json({ error: error.message })
      }
      return res.status(500).json({ error: error.message })
    }
  },

  async verifyMail(req, res, next) {
    try {
      const { token } = req.params
      const id = await Token.verifyMail.verify(token)
      req.login = await Login.viewLogin(id)
      next()
    } catch (error) {
      if (error) {
        return next(error)
      }
    }
  }
}
