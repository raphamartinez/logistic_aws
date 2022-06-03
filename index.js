require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' });
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress');
const appLocals = require("./api/config/app.locals");
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { InvalidArgumentError, NotFound, NotAuthorized, InternalServerError } = require('./api/models/error');
const Middleware = require('./api/infrastructure/auth/middleware');
const { jobAlert } = require('./api/models/job')
const DriveUp = require('./api/models/driveup')
const fs = require("fs");
const config = require("./config.json");
const axios = require("axios");
const Queue = require('bull');
const geoQueue = new Queue('geo transcoding', 'redis://127.0.0.1:6379');

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
    fs.writeFileSync("./last.qr", qr);
  })

  client.on("authenticated", () => {
    console.log("Autenticado!");
    authed = true;

    try {
      fs.unlinkSync("./last.qr");
    } catch (err) { }
  })

  client.on("auth_failure", () => {
    console.log("Autenticação falhou!")
    process.exit()
  })

  client.on('ready', () => {
    console.log('Pronto para uso!');

    // DriveUp.stream()

    // geoQueue.process(function (job, done) {
    //   console.log('executou');
    //   DriveUp.queueResponses(job.data.carLocation)
    //   done()
    // })
  })

  client.on('message', async msg => {
    sleep(1000)
    let autoMsg = ''
    let listPlaces = []
    switch (msg.from) {
      case '120363024113373482@g.us':
        listPlaces = [1, 2, 3, 4]
        if (listPlaces.includes(Number.parseInt(msg.body))) {
          autoMsg = await DriveUp.countInthePlace(msg.body)
          client.sendMessage(msg.from, autoMsg)
        } else {
          autoMsg = '*Comando não identificado*\n'
          autoMsg += 'Segue abaixo lista de comandos.\n\n'
          autoMsg += 'Digite 1 - Listagem de Veículos KM1\n'
          autoMsg += 'Digite 2 - Listagem de Veículos KM28\n'
          autoMsg += 'Digite 3 - Listagem de Veículos Ypane\n'
          client.sendMessage(msg.from, autoMsg)
        }
        break;

      case '120363042760809190@g.us':
        client.sendMessage(msg.from, '*Comando não identificado*')
        break;

      case '120363024386228914@g.us':
        listPlaces = [1, 2, 3, 4]
        if (listPlaces.includes(Number.parseInt(msg.body))) {
          autoMsg = await DriveUp.countInthePlace(msg.body)
          client.sendMessage(msg.from, autoMsg)
        } else {
          autoMsg = '*Comando não identificado*\n'
          autoMsg += 'Segue abaixo lista de comandos.\n\n'
          autoMsg += 'Digite 1 - Listagem de Veículos em Manutenção\n'
          client.sendMessage(msg.from, autoMsg)
        }
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

const chatRoute = require("./components/chatting");
const groupRoute = require("./components/group");
const authRoute = require("./components/auth");
const contactRoute = require("./components/contact");

app.use("/chat", chatRoute);
app.use("/group", groupRoute);
app.use("/auth", authRoute);
app.use("/contact", contactRoute);

app.listen(3000, async () => {
  if (process.env.NODE_ENV !== 'development') {
    // jobAlert.start()
  }

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

});




