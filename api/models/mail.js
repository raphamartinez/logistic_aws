const nodemailer = require('nodemailer')

const configMailProduct = () => ({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

const configMailTest = (accountTest) => ({
    host: 'smtp.ethereal.email',
    auth: accountTest
})

async function createConfigMail() {
    if (process.env.NODE_ENV !== 'production') {
        return configMailProduct
    } else {
        const accountTest = await nodemailer.createTestAccount()
        return configMailTest(accountTest)
    }
}

class Mail {
    async sendMail() {
        const configMail = await createConfigMail();
        const transport = nodemailer.createTransport(configMail)
        const info = await transport.sendMail(this)

        if (process.env.NODE_ENV !== 'production') {
            console.log('URL: ' + nodemailer.getTestMessageUrl(info));
        }
    }
}

class VerifyMail extends Mail {

    constructor(login) {
        super()
        this.from = ''
        this.to = login.mail
        this.subject = 'Prosegur'
        this.text = `Hello, placa: ${veiculo} na data ${data}`
        this.html = `<h1>Hello<h1>, click the link below to verify: <a href="${address}">${address}</a>`
    }
}

class ResetPasswordMail extends Mail {

    constructor(mailenterprise, token) {
        super()
        this.from = `"Logistica" olla.transportes@gmail.com`
        this.to = mailenterprise
        this.subject = 'Restablecimiento de contraseña'
        this.html = ` <body style="margin: 0; padding: 0 !important; background-color: #f1f1f1;">
        <center style="width: 100%;     background-color: #4e73df;
        background-image: linear-gradient(
    180deg
    , #4e73df 10%, #224abe 100%);
        background-size: cover;">
            <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;">
            </div>
            <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                <!-- BEGIN BODY -->
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                    <tr>
                        <td valign="middle" class="hero bg_black" style="padding: 3em 0 2em 0;">
                            <img src="https://informes.americaneumaticos.com.py/img/ansalogowhite.png" alt="" style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block; background-position: center;
                            background-size: cover;">
                        </td>
                    </tr><!-- end tr -->
                    <tr>
                        <td valign="middle" class="hero bg_black" style="padding: 2em 0 4em 0;">
                            <table>
                                <tr>
                                    <td>
                                        <div class="text" style="padding: 0 2.5em; text-align: center;  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";     font-size: 1.5rem;">
                                            <h2>Hola, vimos que solicitó un restablecimiento de contraseña!</h2>
                                            <span> Si es así, haga clic en el enlace de abajo para realizar el cambio:</span>
                                            <br>
                                            <a href="https://informes.americaneumaticos.com.py/newPassword/${token}">Enlace de acceso</a>
                                            <br>
                                            <span> El enlace tiene una duración de 24 horas.</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr><!-- end tr -->
                    <!-- 1 Column Text + Button : END -->
                </table>
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                    <tr>
                        <td valign="middle" class="bg_light footer email-section">
                            <table>
                                <tr>
                                    <td valign="top" width="50%" style="padding-top: 10px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                                                    <h2 class="heading">Entre en contacto</h2>
                                                    <ul>
                                                        <li><span class="text">Teléfono +595982206119</span></li>
                                                        <li><span class="text">informes.adm@americaneumaticos.com</span></li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" width="50%" style="padding-top: 10px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="text-align: right; padding-right: 10px;">
                                                    <h2 class="heading">Links</h2>
                                                    <ul>
                                                    <li><a href="http://www.americaneumaticos.com.py//">Site WEB ANSA</a></li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr><!-- end: tr -->
                    <!--                                            <tr>
                                                                    <td class="bg_light" style="text-align: center;">
                                                                        <p>No longer want to receive these email? You can <a href="#" style="color: rgba(0,0,0,.8);">Unsubscribe here</a></p>
                                                                    </td>
                                                                </tr>-->
                </table>
    
            </div>
        </center>
    </body>`
    }
}

class QuizMail extends Mail {

    constructor(user, quiz, token) {
        super()
        this.from = `"Logistica" olla.transportes@gmail.com`
        this.to = user.mail
        this.subject = `Cuestionário de ${quiz.title}`
        this.html = ` <body style="margin: 0; padding: 0 !important; background-color: #f1f1f1;">
        <center style="width: 100%;     background-color: #860000;
        background-image: linear-gradient(
    180deg
    , #860000  10%, #860011 100%);
        background-size: cover;">
            <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;">
            </div>
            <div style="max-width: 600px; margin: 0 auto;" class="email-container">

                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                    <tr>
                        <td valign="middle" class="hero bg_black" style="padding: 2em 0 4em 0;">
                            <table>
                                <tr>
                                    <td>
                                        <div class="text" style="padding: 0 2.5em; text-align: center;  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";     font-size: 1.5rem;">
                                            <h2>Hola ${user.name}, te enviamos un cuestionario de ${quiz.title}!</h2>
                                            <span> A continuación se muestra un enlace para acceder al cuestionario:</span>
                                            <br>
                                            <a href="http://54.161.250.7/quiz/public/${token}">Enlace de acceso</a>
                                            <br>
                                            <span> El enlace tiene una duración de 24 horas.</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                    <tr>
                        <td valign="middle" class="bg_light footer email-section">
                        </td>
                    </tr>
                </table>
            </div>
        </center>
    </body>`
    }
}


class AttachmentBi extends Mail {

    constructor(title, body, recipients, cc, bcc, attachment) {
        super()
        this.from = ''
        this.to = recipients
        this.cc = cc
        this.bcc = bcc
        this.subject = title
        this.text = body
        this.attachments = attachment
        //{
          //filename: 'image1.jpg',
          //  path: __dirname + '/image1.jpg'
        //}
    }
}


module.exports = { VerifyMail, ResetPasswordMail, AttachmentBi, QuizMail }