const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const fetch = require('node-fetch')
const { Location } = require("whatsapp-web.js");
const Repositorie = require('../repositories/driveup')

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

class DriveUp {

    async vehicleAlerts() {

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() + (-60 * 60000))
        const month = startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : `0${startDate.getMonth() + 1}`
        const day = startDate.getDate() > 9 ? startDate.getDate() : `0${startDate.getDate()}`
        const minutes = startDate.getMinutes() > 9 ? startDate.getMinutes() : `0${startDate.getMinutes()}`
        const hours = startDate.getHours() > 9 ? startDate.getHours() : `0${startDate.getHours()}`

        console.log({ now: endDate.toLocaleString() })
        console.log(`${startDate.getFullYear()}-${month}-${day}T${hours}:${minutes}`)
        const data = await fetch(`https://api.driveup.info/rest/vehicle/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            },
            // body: JSON.stringify({
            //     "from": "2022-05-21T17:59:59Z",
            //     "to":"2022-05-23T17:59:59Z"
            // })

            body: JSON.stringify({
                'from': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:00:00Z`,
                'to': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:59:59Z`
            })
        })

        const vehicleAlerts = await data.json()
        console.log(vehicleAlerts);
        return vehicleAlerts
    }

    async cars() {

        const data = await fetch(`https://api.driveup.info/vehicles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const cars = await data.json();
        return cars
    }

    async customers() {

        const data = await fetch(`https://api.driveup.info/rest/geofence/geofence`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const customers = await data.json();
        return customers
    }

    async alertTypes() {

        const data = await fetch(`https://api.driveup.info/rest/alert/types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })

        const alerts = await data.json();
        return alerts
    }

    async saveAlerts(vehicleAlerts, cars, alerts, customers) {
        for (let vehicleAlert of vehicleAlerts) {
            let customer = vehicleAlert.data ? customers.find(customer => customer.id === vehicleAlert.data.idzona) : ''
            let car = cars.find(car => car.vehicleId === vehicleAlert.idVehicle)
            if (customer) { vehicleAlert.customer = customer.name }
            vehicleAlert.car = {
                plate: car.plate.replace(/\s+/g, ''),
                model: car.modelDescription,
                category: car.kind
            }

            let alertType = ''
            let group = ''

            alerts.find(alert => {
                alert.types.forEach(type => {
                    if (type.ideventtype === vehicleAlert.idEventType) {
                        const idgroup = alert.ideventtypegroup
                        if (idgroup === 9 || idgroup === 10 || idgroup === 12) {
                            group = 'Manutenção'
                            alertType = type.description
                        }

                        if (idgroup === 3 || idgroup === 4 || idgroup === 5 || idgroup === 11) {
                            group = 'Operação'
                            alertType = type.description
                        }

                        if (idgroup === 2) {
                            group = 'Cliente'
                            switch (type.ideventtype) {
                                case 3:
                                    alertType = `Llegada al ${vehicleAlert.customer}`
                                    break
                                case 4:
                                    alertType = `Salída del ${vehicleAlert.customer}`
                                    break
                            }
                        }
                    }
                })
            })
            vehicleAlert.alert = alertType
            vehicleAlert.successend = 0
            vehicleAlert.successendloc = 0
            const date = new Date(vehicleAlert.recordedat)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + (-4) * 60 * 60 * 1000);

            let message = `*${vehicleAlert.alert}*\n${vehicleAlert.car.plate} - ${vehicleAlert.car.category}\nSin informacion del Chofer\n`
            message += `${date.toLocaleTimeString('pt-BR')} ${date.toLocaleDateString('pt-BR')}\n`
            vehicleAlert.message = message
            vehicleAlert.group = group
            if (vehicleAlert.data) {
                vehicleAlert.idzona = vehicleAlert.data.idzona
                vehicleAlert.odometer = vehicleAlert.data.odometer
            }
            client.getChats().then((data) => {
                data.forEach(chat => {
                    if (chat.id.server === "g.us" && chat.name === group) {
                        client.sendMessage(chat.id._serialized, message).then((response) => {
                            if (response.id.fromMe) {
                                vehicleAlert.successend = 1
                                sleep(1000)
                                let loc = new Location(vehicleAlert.geom.coordinates[1], vehicleAlert.geom.coordinates[0], vehicleAlert.alert || "");
                                client.sendMessage(chat.id._serialized, loc).then(() => vehicleAlert.successendloc = 1)
                                sleep(1000)
                                return true
                            }
                        }).catch(err => console.log({msg: 'envio erro', err}))
                    }
                });
            }).catch(err => console.log({msg: `listagem erro`, err}));

            console.log(vehicleAlert);

            await Repositorie.insert(vehicleAlert)

        }
    }

    async stream() {

        const stream = await fetch(`https://api.driveup.info/stream`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        })
    }

}

module.exports = new DriveUp