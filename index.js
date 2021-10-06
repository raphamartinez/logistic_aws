require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const connection = require('./api/infrastructure/database/connection')
const tables = require('./api/infrastructure/database/tables')
const User = require('./api/models/user')

const jwt = require('jsonwebtoken')
const express = require('express')
const path = require('path')
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');

process.setMaxListeners(100)
const app = customExpress()

// connection.connect(err => {
//   if(err){
//     console.log(err);
//   }else{
//     tables.init(connection)
// const data = {
//   user: {
//     name: 'Admin',
//     perfil: 1,
//     login: {
//       access: 'adm@sunset',
//       password: 'sunset21',
//       mailVerify: 1,
//       status: 1
//     }
//   }
// }
// User.insertUser(data)

//   }
// })

app.set('views', [path.join(__dirname, 'views/public'), path.join(__dirname, 'views/admin')])
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.listen(80, () => {

  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/views'))
  app.use(express.static(__dirname + '/tmp'))

  app.get('/', function (req, res) {
    res.render('login');
  });
});

app.use((err, req, res, next) => {

  let status = 500
  const body = {
    message: 'Hubo un problema al realizar la operación. Intenta más tarde'
  }

  if (err instanceof NotFound) {
    status = 404
    body.dateExp = err.dateExp
  }

  if (err instanceof NotAuthorized) {
    status = 401
    body.dateExp = err.dateExp
  }

  if (err instanceof InvalidArgumentError) {
    status = 400
  }

  if (err instanceof jwt.JsonWebTokenError) {
    status = 401
  }

  if (err instanceof jwt.TokenExpiredError) {
    status = 401
    body.dateExp = err.dateExp
  }

  res.status(status)
  res.json(body)

})