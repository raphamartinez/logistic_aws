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
        const startDate = new Date(endDate.getTime() + (-30 * 60000))
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
            body: JSON.stringify({
                'from': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:${minutes}:00Z`,
                'to': `${startDate.getFullYear()}-${month}-${startDate.getDate()}T${hours}:${endDate}:59Z`
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

            const travel = await Repositorie.findTravel(vehicleAlert.car.plate)

            alerts.find(alert => {
                alert.types.forEach(type => {
                    if (type.ideventtype === vehicleAlert.idEventType) {
                        const idgroup = alert.ideventtypegroup
                        if (idgroup === 9 || idgroup === 10 || idgroup === 12) {
                            group = 'Operación Manten.'
                            alertType = type.description
                        }

                        if (idgroup === 3 || idgroup === 4 || idgroup === 5 || idgroup === 11) {
                            group = 'Operación Disponibilidad'
                            alertType = type.description
                        }

                        if (idgroup === 2) {
                            group = 'Operación Notific.'
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
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + (-3) * 60 * 60 * 1000)

            let message = `*${vehicleAlert.alert}*\n${travel.carConcatenate}\nSin informacion del Chofer\n`
            message += `${date.toLocaleTimeString('pt-BR')} ${date.toLocaleDateString('pt-BR')}\n`
            message += `\n@${vehicleAlert.geom.coordinates[1]},${vehicleAlert.geom.coordinates[0]}`
            message += `Origen: ${travel.origin} - Destino: ${travel.destiny}`
            vehicleAlert.message = message
            vehicleAlert.group = group
            if (vehicleAlert.data) {
                vehicleAlert.idzona = vehicleAlert.data.idzona
                vehicleAlert.odometer = vehicleAlert.data.odometer
            }
            client.getChats().then((data) => {
                data.forEach(chat => {
                    if (chat.id.server === "g.us" && chat.id === group) {
                        client.sendMessage(chat.id._serialized, message).then((response) => {
                            if (response.id.fromMe) {
                                vehicleAlert.successend = 1
                                sleep(1500)
                                let loc = new Location(vehicleAlert.geom.coordinates[1], vehicleAlert.geom.coordinates[0], vehicleAlert.alert || "");
                                client.sendMessage(chat.id._serialized, loc).then(() => vehicleAlert.successendloc = 1)
                                sleep(3000)
                                return true
                            }
                        }).catch(err => console.log({ msg: 'envio erro', err }))
                    }
                })
            }).catch(err => console.log({ msg: `listagem erro`, err }))

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

    async countInthePlace(place) {
        try {

            let descPlace = ''
            let message = ''
            switch (place) {
                case '1':
                    place = '5523'
                    descPlace = 'KM 1'
                    break
                case '2':
                    place = '5436'
                    descPlace = 'KM 28'
                    break
                case '3':
                    place = '5524'
                    descPlace = 'YPANE'
                    break
                case '4':
                    place = '00'
                    descPlace = 'MANTENIMIENTO'
                    break
            }

            if (place === '00') {
                const allCarsMaintenance = await Repositorie.countInMaintenance()
                if (allCarsMaintenance.length == 0) {
                    message = `*No hay vehiculos en Mantenimiento*`
                } else {
                    message = `*Vehiculos en Mantenimiento*`
                    allCarsMaintenance.forEach(car => message += `*${car.plate}* - ${car.description}\n`)
                }

                return message
            }

            const cars = await Repositorie.countInthePlace(place)

            message = `*No hay vehículos disponibles en ${descPlace}*\n`
            if (cars.length > 0) {
                message = `*Sigue abajo listado de vehiculos en ${descPlace}*\n\n`
                cars.forEach(car => message += `${car.plate}\n`)
            }

            if (place == '5523') return message

            const carsMaintenance = await Repositorie.countInMaintenance(descPlace)

            if (carsMaintenance.length == 0) {
                message += `\n*No hay vehiculos en Mantenimiento en ${descPlace}*`
            } else {
                message += `\n*Vehiculos en Mantenimiento en ${descPlace}*\n\n`
                carsMaintenance.forEach(car => message += `${car.plate}\n`)
            }

            return message
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new DriveUp