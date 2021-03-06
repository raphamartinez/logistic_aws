const express = require('express')
const passport = require('passport');
const cors = require('cors')
const consign = require('consign')
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash')
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const client = redis.createClient();

module.exports = () => {

  require('../infrastructure/redis/blocklist')
  require('../infrastructure/redis/allowlist')

  const app = express()

  app.use(cors())

  require('../infrastructure/auth/strategy')

  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] == "http")
      res.redirect(`https://${req.headers.host}${req.url}`)
    else {
      next();
    }
  })

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  let sess = {
    store: new RedisStore({ client }),
    secret: process.env.KEY_JWT,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000
    }
  }

  // if (process.env.NODE_ENV !== 'development') {
  //   app.set('trust proxy', 1)
  //   sess.cookie.secure = true
  // }

  app.use(session(sess))

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.set('X-Powered-By', 'PHP/7.1.7');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", 'Origin, Accept, Accept-Version, Content-Security-Policy, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Frame-Options, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    next();
  });

  app.use(flash());

  consign({ cwd: path.join(__dirname, '../') })
    .include('models')
    .then('controllers')
    .into(app)

  return app
}
