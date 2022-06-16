require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' });
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress');
const appLocals = require("./api/config/app.locals");
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');
const Middleware = require('./api/infrastructure/auth/middleware');
const DriveUp = require('./api/models/driveup')
const fs = require("fs");
const config = require("./config.json");
const axios = require("axios");
const Queue = require('./api/infrastructure/redis/queue');

const { Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const app = customExpress();

app.locals = appLocals;

if (process.env.NODE_ENV !== 'development') {
  const myCustomId = '33'

  const authStrategy = new LocalAuth({ clientId: myCustomId })

  const worker = `${authStrategy.dataPath}/session-${myCustomId}/Default/Service Worker`
  if (fs.existsSync(worker)) {
    fs.rmSync(worker, { recursive: true })
  }

  process.title = "whatsapp-node-api"
  global.client = new Client({
    authStrategy: authStrategy,
    puppeteer: {
      headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: '', takeoverOnConflict: true,
      takeoverTimeoutMs: 10
    },
  });

  global.authed = false;

  client.on('qr', (qr) => {
    fs.writeFileSync("./last.qr", qr)
  })

  client.on("authenticated", () => {
    console.log("Autenticado!")
    authed = true

    try {
      fs.unlinkSync("./last.qr")
    } catch (err) { }
  })

  client.on("auth_failure", () => {
    console.log("Autenticação falhou!")
    process.exit()
  })

  client.on('ready', () => {
    console.log('Pronto para uso!');
    DriveUp.stream()
    Queue.process()
  })

  client.on('message', async msg => {
    sleep(1000)
    if (process.env.NODE_ENV === 'development') return null
    let autoMsg = ''
    let listPlaces = []
    switch (msg.from) {
      case '120363024113373482@g.us':
        listPlaces = [1, 2, 3, 4, 5]
        if (listPlaces.includes(Number.parseInt(msg.body))) {
          autoMsg = await DriveUp.countInthePlace(msg.body)
          client.sendMessage(msg.from, autoMsg)
        } else {
          autoMsg = '*Comando no identificado*\n'
          autoMsg += 'Sigue abajo listado de comandos.\n\n'
          autoMsg += 'Digite 1 – Listado de Vehículos KM1\n'
          autoMsg += 'Digite 2 – Listado de Vehículos KM28\n'
          autoMsg += 'Digite 3 – Listado de Vehículos Ypane\n'
          autoMsg += 'Digite 4 – Listado de Vehículos en Mantenimiento\n'
          autoMsg += 'Digite 5 - Listado de Vehiculos en Ruta\n\n'
          autoMsg += 'Se puede acceder a la información a través del portal OLA - https://sistema.olla.com.py/disponibilidad'
          client.sendMessage(msg.from, autoMsg)
        }
        break;

      case '120363042760809190@g.us':
        client.sendMessage(msg.from, '*Comando no identificado*')
        break;

      case '120363024386228914@g.us':
        listPlaces = [1, 2, 3, 4, 5]
        if (listPlaces.includes(Number.parseInt(msg.body))) {
          autoMsg = await DriveUp.countInthePlace(msg.body)
          client.sendMessage(msg.from, autoMsg)
        } else {
          autoMsg = '*Comando no identificado*\n'
          autoMsg += 'Sigue abajo listado de comandos.\n\n'
          autoMsg += 'Digite 1 - Listado de Vehículos en Mantenimiento\n'
          client.sendMessage(msg.from, autoMsg)
        }
        break;

      case '120363023896820238@g.us':
        const historic = await DriveUp.historicContainer(msg.body)
        autoMsg = historic ? historic : `Sin resultados para este numero de contenedor.`
        client.sendMessage(msg.from, autoMsg)
        break;
    }

    if (config.webhook.enabled) {
      if (msg.hasMedia) {
        const attachmentData = await msg.downloadrsMedia();
        msg.attachmentData = attachmentData;
      }
      axios.post(config.webhook.path, { msg });
    }
  })

  client.on("disconnected", () => {
    console.log("Disconectado!");
  })

  client.initialize()
}

const authRoute = require("./components/auth")
app.use("/auth", authRoute)

app.listen(3000, async () => {
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
  })
})

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
    return res.redirect('login?fail=true')
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

})




