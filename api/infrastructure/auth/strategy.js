const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Login = require('../../models/login')
const { NotAuthorized, InvalidArgumentError } = require('../../models/error')

function verifyLogin(login) {
  if (!login) {
    throw new NotAuthorized('Acceso no autorizado al recurso solicitado.')
  }
}

async function verifyPassword(password, passwordHash) {
  const passwordValid = await bcrypt.compare(password, passwordHash)

  if (!passwordValid) {
    throw new NotAuthorized('Las contraseñas ingresadas no coinciden.')
  }
}

passport.serializeUser((login, done) => {
  done(null, login.id);
})

passport.deserializeUser(async (id_login, done) => {
  try {
    const login = await Login.viewLogin(id_login)
    done(null, login);

  } catch (error) {
    console.log(error);
    return done(err, null);
  }
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password'
    },
    async (mail, password, done) => {
      try {
        const login = await Login.searchMail(mail);
        verifyLogin(login.access);
        await verifyPassword(password, login.password);
        return done(null, login);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);





