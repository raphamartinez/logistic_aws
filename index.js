require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const appLocals = require("./api/config/app.locals");
const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');
const Middleware = require('./api/infrastructure/auth/middleware');

// const Purchase = require('./api/repositories/purchase')
// Purchase.getOrders()
// Quiz.answer()

process.setMaxListeners(100);

const app = customExpress();

app.locals = appLocals;

app.listen(80, () => {

  app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin'), path.join(__dirname, 'views/quiz')])
  app.set('view engine', 'ejs');

  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/views'))
  app.use(
    "/files",
    express.static(path.resolve(__dirname, 'tmp', 'uploads'))
  );

  app.get('/', Middleware.authenticatedMiddleware, async function (req, res) {
    try {
      res.render('dashboard', {
        perfil: req.login.perfil,
        name: req.login.name
      });
    } catch (error) {
      res.render('login');
    }
  });
});

app.use((err, req, res, next) => {

  console.log(err);
  let status = 500;
  const body = {
    message: 'Hubo un problema al realizar la operación. Intenta más tarde'
  };

  if (err instanceof NotFound) {
    status = 404;
    body.dateExp = err.dateExp;
  }

  if (err instanceof NotAuthorized) {
    status = 401;
    body.dateExp = err.dateExp;
  }

  if (err instanceof InvalidArgumentError) {
    status = 400;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
  }

  if (err instanceof jwt.TokenExpiredError) {
    status = 401;
    body.dateExp = err.dateExp;
  }

  res.status(status);
  res.json(body);

});




