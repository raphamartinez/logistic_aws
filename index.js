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

const fs = require("fs");
const config = require("./config.json");
const axios = require("axios");

const { Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
//t
process.title = "whatsapp-node-api"
global.client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
});

global.authed = false;

const app = customExpress();

app.locals = appLocals;

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
})

client.on('message', async msg => {
  sleep(1000)

  switch (msg.from) {
    case '120363024113373482@g.us':
      if (msg.body == 1) {
        client.sendMessage(msg.from, 'Lista de veículos')

      } else {
        client.sendMessage(msg.from, 'Comando não identificado.')
      }
      break;

    case '120363042760809190@g.us':
      client.sendMessage(msg.from, 'Comando não identificado.')
      break;

    case '120363024386228914@g.us':
      client.sendMessage(msg.from, 'Comando não identificado.')
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

client.initialize();

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
    jobAlert.start()
  }

  // const accountSid = 'ACb4c65c28be97beefef37739144f2908a'
  // const authToken = 'ada5c3e9da927de130c0d8225cddc6aa'
  // const client = require('twilio')(accountSid, authToken)
  // client.messages.create(
  //   {
  //     body: 'esta funcionando ok ',
  //     from: 'whatsapp:+14155238886',
  //     to: 'whatsapp:+5511971570063'
  //   })
  //   .then(message => console.log(message)).done();

  // const id_token = await Movias.Login()
  // const cars = await Movias.Cars(id_token)
  // await Movias.Tracking(cars, id_token)

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




