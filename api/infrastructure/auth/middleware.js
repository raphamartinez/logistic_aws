const Login = require('../../models/login');

module.exports = {
  async authenticatedMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
      const login = await Login.viewLogin(req.session.passport.user)
      req.login = login
      res.locals.username = login.name
      res.locals.perfil = login.profile

      return next();
    }
    res.redirect('/login');
  },
}
