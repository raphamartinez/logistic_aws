const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Twilio {

    send(body, to) {
        const accountSid = 'ACb4c65c28be97beefef37739144f2908a'
        const authToken = 'ada5c3e9da927de130c0d8225cddc6aa'
        const client = require('twilio')(accountSid, authToken)
        client.messages.create(
            {
                body: body,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+${to}`
            })
            .then(message => console.log(message)).done();
    }

}

module.exports = new Twilio