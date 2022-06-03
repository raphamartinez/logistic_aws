const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const fetch = require('node-fetch')
const { Location } = require("whatsapp-web.js");
const Repositorie = require('../repositories/driveup')
const RepositorieTravel = require('../repositories/travel')
const https = require('https');
const classifyPoint = require("robust-point-in-polygon")
const Queue = require('bull');
const geoQueue = new Queue('geo transcoding', 'redis://127.0.0.1:6379');

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
        const minutesEnd = endDate.getMinutes() > 9 ? endDate.getMinutes() : `0${endDate.getMinutes()}`
        const hoursEnd = endDate.getHours() > 9 ? endDate.getHours() : `0${endDate.getHours()}`
        const dayEnd = endDate.getDate() > 9 ? endDate.getDate() : `0${endDate.getDate()}`
        const monthEnd = endDate.getMonth() > 9 ? endDate.getMonth() + 1 : `0${endDate.getMonth() + 1}`

        const startDate = new Date(endDate.getTime() + (-30 * 60000))
        const month = startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : `0${startDate.getMonth() + 1}`
        const day = startDate.getDate() > 9 ? startDate.getDate() : `0${startDate.getDate()}`
        const minutes = startDate.getMinutes() > 9 ? startDate.getMinutes() : `0${startDate.getMinutes()}`
        const hours = startDate.getHours() > 9 ? startDate.getHours() : `0${startDate.getHours()}`

        console.log(`${startDate.getFullYear()}-${month}-${day}T${hours}:${minutes}`)
        console.log({ now: endDate.toLocaleString() })

        const data = await fetch(`https://api.driveup.info/rest/vehicle/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            },
            // body: JSON.stringify({
            //     'from': `${startDate.getFullYear()}-${month}-${day}T${hours}:${minutes}:00Z`,
            //     'to': `${endDate.getFullYear()}-${monthEnd}-${dayEnd}T${hoursEnd}:${minutesEnd}:59Z`
            // })
            body: JSON.stringify({
                "from": "2022-06-03T11:45:00Z",
                "to": "2022-06-03T12:45:00Z"
            })
        })

        const vehicleAlerts = await data.json()
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

    async saveAlerts(vehicleAlertsArr, cars, alerts, customers) {

        let checkAlert = {}
        let vehicleAlerts = []

        vehicleAlertsArr.forEach(alert => {
            switch (alert.idEventType) {
                case 3: //Llegada
                    if (checkAlert.data) vehicleAlerts.push(checkAlert)
                    checkAlert = alert
                    return null
                case 4: //Salida
                    if (checkAlert && alert.idVehicle == checkAlert.idVehicle && alert.data && alert.data.idzona == checkAlert.data.idzona) {
                        const dtInit = new Date(checkAlert.recordedat)
                        const dtEnd = new Date(alert.recordedat)
                        const difference = dtEnd.getTime() - dtInit.getTime()
                        const twoSecondsInMilisseconds = 120000
                        if (difference < twoSecondsInMilisseconds) {
                            checkAlert = {}
                            return null
                        } else {
                            vehicleAlerts.push(checkAlert)
                            vehicleAlerts.push(alert)
                            checkAlert = {}
                            return null
                        }
                    } else {
                        if (checkAlert.data) vehicleAlerts.push(checkAlert)
                        checkAlert = {}
                        vehicleAlerts.push(alert)
                    }
                    break
                case 32: //Inicio de Detencion
                    return null
                default: //Otros
                    vehicleAlerts.push(alert)
                    break
            }
        })

        console.log({ messages: vehicleAlerts.length })

        for (let vehicleAlert of vehicleAlerts) {
            let customer = vehicleAlert.data ? customers.find(customer => customer.id === vehicleAlert.data.idzona) : ''
            let car = cars.find(car => car.vehicleId === vehicleAlert.idVehicle)
            if (customer) { vehicleAlert.customer = customer.name }
            vehicleAlert.car = {
                plate: car.plate.split(' ')[0] == 'XBRI' ? 'XBRI010' : car.plate.split(' ')[0],
                model: car.modelDescription,
                category: car.kind
            }

            let alertType = ''
            let group = ''

            console.log(vehicleAlert.car.plate);
            const travel = await Repositorie.findTravel(vehicleAlert.car.plate)

            if (travel.id) {
                let carsTravel = await RepositorieTravel.listPlates(travel.id)
                travel.carsTravel = carsTravel

                if (travel.carsTravel && travel.carsTravel.length == 2) {
                    travel.capacity = travel.carsTravel[1].capacity
                } else {
                    travel.capacity = travel.carsTravel[0].capacity
                }
            }

            alerts.find(alert => {
                alert.types.forEach(type => {
                    if (type.ideventtype === vehicleAlert.idEventType) {
                        const idgroup = alert.ideventtypegroup
                        if (idgroup === 9 || idgroup === 10 || idgroup === 12) {
                            group = '120363024386228914@g.us' // manten 
                            alertType = type.description
                        }

                        if (idgroup === 3 || idgroup === 4 || idgroup === 5 || idgroup === 11) {
                            group = '120363024113373482@g.us' //op disp
                            alertType = type.description
                        }

                        if (idgroup === 2) {
                            group = '120363042760809190@g.us' // cliente
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

            function titleCase(str) {
                var splitStr = str.toLowerCase().split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                return splitStr.join(' ');
            }

            vehicleAlert.alert = alertType
            vehicleAlert.successend = 0
            vehicleAlert.successendloc = 0
            const date = new Date(vehicleAlert.recordedat)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + (-3) * 60 * 60 * 1000)
            let message = `*${vehicleAlert.alert}*`
            message += `\n${vehicleAlert.car.plate}`
            if (travel.plate) message += ` - _${titleCase(travel.cartype)} - Capacidad ${travel.capacity}_`
            if (travel.driverdesc) message += `\nChofer - ${titleCase(travel.driverdesc)}`
            message += `\n${date.toLocaleTimeString('pt-BR')} ${date.toLocaleDateString('pt-BR')}\n`
            message += `\n@${vehicleAlert.geom.coordinates[1]},${vehicleAlert.geom.coordinates[0]}`
            if (travel.origin) message += `\nSalida: ${travel.origindesc}`
            if (travel.route) message += ` - Retiro: ${travel.routedesc}`
            if (travel.delivery) message += ` - Entrega: ${travel.deliverydesc}`

            vehicleAlert.message = message
            vehicleAlert.group = group
            if (vehicleAlert.data) {
                vehicleAlert.idzona = vehicleAlert.data.idzona
                vehicleAlert.odometer = vehicleAlert.data.odometer
            }

            if (process.env.NODE_ENV !== 'development') {
                client.getChats().then((data) => {
                    for (let chat of data) {
                        if (chat.id.server === "g.us" && chat.id._serialized == group) {
                            client.sendMessage(chat.id._serialized, message).then(() => vehicleAlert.successend = 1)
                            sleep(2000)
                            let loc = new Location(vehicleAlert.geom.coordinates[1], vehicleAlert.geom.coordinates[0], vehicleAlert.alert || "")
                            client.sendMessage(chat.id._serialized, loc).then(() => vehicleAlert.successendloc = 1)
                            sleep(2000)
                            return true
                        }
                    }
                }).catch(err => console.log({ msg: `listagem erro`, err }))
            }

            await Repositorie.insert(vehicleAlert)
        }
    }


    sendMessage(carLocation, travel) {
        let groupId = '120363042760809190@g.us'
        let alertType = ''
        const now = new Date(carLocation.recordedat)
        switch (carLocation.isInside) {
            case -1:
                alertType = `Llegada al ${carLocation.location}`
                break
            case 0:
                alertType = `Salída del ${carLocation.location}`
                break
            case 1:
                alertType = `Acerca del ${carLocation.location}`
                break
        }

        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }

        let message = `*${alertType}*`
        message += `\n${carLocation.plate}`
        if (travel.plate) message += ` - _${titleCase(travel.cartype)} - Capacidad ${travel.capacity}_`
        if (travel.driverdesc) message += `\nChofer - ${titleCase(travel.driverdesc)}`
        message += `\n${now.toLocaleTimeString('pt-BR')} ${now.toLocaleDateString('pt-BR')}\n`
        message += `\n@${carLocation.lat},${carLocation.long}`
        if (travel.origin) message += `\nSalida: ${travel.origindesc}`
        if (travel.route) message += ` - Retiro: ${travel.routedesc}`
        if (travel.delivery) message += ` - Entrega: ${travel.deliverydesc}`

        if (process.env.NODE_ENV !== 'development') {
            client.getChats().then((data) => {
                for (let chat of data) {
                    if (chat.id.server === "g.us" && chat.id._serialized == groupId) {
                        client.sendMessage(chat.id._serialized, message)
                        sleep(2000)
                        let loc = new Location(carLocation.lat, carLocation.lng, alertType || "")
                        client.sendMessage(chat.id._serialized, loc)
                        sleep(2000)
                        return true
                    }
                }
            }).catch(err => console.log({ msg: `listagem erro`, err }))
        }
    }


    async stream() {

        let request = https.get('https://api.driveup.info/stream', {
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Invalid Response of DriveUp - Code: ${res.statusCode}`);
                res.resume();
                return;
            }

            let data = '';

            res.on('data', (chunk) => {
                const buffer = Buffer.from(chunk)
                const string = buffer.toString()
                const carLocation = JSON.parse(string)

                geoQueue.add({ carLocation })
            })

            res.on('close', () => {
                console.log('Closed connection');
            });
        })
    }

    async queueResponses(carLocation) {
        try {
            const customers = [
                {
                    name: 'SUNSET KM1',
                    coordinates: [[-54.616398, -25.509047], [-54.616398, -25.5082], [-54.615883, -25.5082], [-54.615883, -25.509047], [-54.616398, -25.509047]]
                },
                {
                    name: 'SUNSET KM28',
                    coordinates: [[-54.882118, -25.489083], [-54.883994, -25.488989], [-54.883932, -25.487659], [-54.882599, -25.487702], [-54.882546, -25.486518], [-54.882535, -25.485993], [-54.882138, -25.486012], [-54.882131, -25.48611], [-54.881739, -25.486128], [-54.881831, -25.487478], [-54.881921, -25.487604], [-54.881966, -25.488418], [-54.882009, -25.489081], [-54.882118, -25.489083]]
                },
                {
                    name: 'SUNSET YPANE',
                    coordinates: [[-57.487952, -25.485618], [-57.489485, -25.484621], [-57.491094, -25.486364], [-57.487952, -25.485618]]
                }
            ]

            const cars = [
                {
                    code: 'XBRI106TRA',
                    plate: 'XBRI106'
                },
                {
                    code: 'XBRI107TRASCAN',
                    plate: 'XBRI107'
                },
                {
                    code: 'BAT633CAMHYUN',
                    plate: 'BAT633'
                },
                {
                    code: 'CEO412CAMFOTO',
                    plate: 'CEO412'
                },
                {
                    code: 'CEV932CAMFUSO',
                    plate: 'CEV932'
                },
                {
                    code: 'XBRI005TRASCAN',
                    plate: 'XBRI005'
                },
                {
                    code: 'XBRI007TRASCAN',
                    plate: 'XBRI007'
                },
                {
                    code: 'XBRI002TRASCAN',
                    plate: 'XBRI002'
                },
                {
                    code: 'CEO411CAMFOTO',
                    plate: 'CEO411'
                },
                {
                    code: 'CAS702CAMHYUN',
                    plate: 'CAS702'
                },
                {
                    code: 'CEU784CAMFUSO',
                    plate: 'CEU784'
                },
                {
                    code: 'CEV912CAMFUSO',
                    plate: 'CEV912'
                },
                {
                    code: 'BLA554CAMVOLK',
                    plate: 'BLA554'
                },
                {
                    code: 'XBRI003TRASCAN',
                    plate: 'XBRI003'
                },
                {
                    code: 'CFP306TRAFAW',
                    plate: 'CFP306'
                },
                {
                    code: 'AYD885CAMVOLK',
                    plate: 'AYD885'
                },
                {
                    code: 'AEA217CAMMERC',
                    plate: 'AEA217'
                },
                {
                    code: 'CEO407CAMFOTO',
                    plate: 'CEO407'
                },
                {
                    code: 'CAB977AUTOKIA',
                    plate: 'CAB977'
                },
                {
                    code: 'CAS594CAMHYUN',
                    plate: 'CAS594'
                },
                {
                    code: 'BFH923DOBLEVOLK',
                    plate: 'BFH923'
                },
                {
                    code: 'CEV933TRAMERC',
                    plate: 'CEV933'
                },
                {
                    code: 'CFP304TRAFAW',
                    plate: 'CFP304'
                },
                {
                    code: 'CFC349TRAVOLK',
                    plate: 'CFC349'
                },
                {
                    code: 'CFN459TRAFAW',
                    plate: 'CFN459'
                },
                {
                    code: 'CFP305TRAFAW',
                    plate: 'CFP305'
                },
                {
                    code: 'CFN458TRAFAW',
                    plate: 'CFN458'
                },
                {
                    code: 'XBRI006TRASCAN',
                    plate: 'XBRI106'
                },
                {
                    code: 'XBRI008TRASCAN',
                    plate: 'XBRI108'
                },
                {
                    code: 'CCP584DOBLESCAN',
                    plate: 'CCP584'
                },
                {
                    code: 'XBRI004TRASCAN',
                    plate: 'XBRI004'
                },
                {
                    code: 'XBRI001TRASCAN',
                    plate: 'XBRI001'
                },
                {
                    code: 'CAS025TRASCAN',
                    plate: 'CAS025'
                },
                {
                    code: 'CEV934TRAMERC',
                    plate: 'CEV934'
                },
                {
                    code: 'CEU782CAMFUSO',
                    plate: 'CEU782'
                },
                {
                    code: 'CFP302TRAFAW',
                    plate: 'CFP302'
                },
                {
                    code: 'CEV913CAMFUSO',
                    plate: 'CEV913'
                }
            ]

            customers.forEach(customer => {
                const isInside = classifyPoint(customer.coordinates, [carLocation.lng, carLocation.lat])
                if (isInside !== 1) {
                    carLocation.isInside = isInside
                    carLocation.location = customer.name
                }
            })

            if (!carLocation.isInside) {
                carLocation.isInside = 1
                carLocation.location = ''
            }

            let car = cars.find(car => car.code === carLocation.plate)
            if (car) {
                carLocation.code = carLocation.plate
                carLocation.plate = car.plate
            }

            const now = new Date(carLocation.recordedat)
            now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + (-3) * 60 * 60 * 1000)
            carLocation.recordedat = now

            const check = await Repositorie.checkIntheLocation(carLocation.plate)
            if (check.length === 0) {
                await Repositorie.insertLocation(carLocation)
                if (carLocation.isInside !== 1) {
                    const travel = await Repositorie.findTravel(carLocation.plate)

                    if (travel.id) {
                        let carsTravel = await RepositorieTravel.listPlates(travel.id)
                        travel.carsTravel = carsTravel

                        if (travel.carsTravel && travel.carsTravel.length == 2) {
                            travel.capacity = travel.carsTravel[1].capacity
                        } else {
                            travel.capacity = travel.carsTravel[0].capacity
                        }
                    }
                    return this.sendMessage(carLocation, travel)
                }
                return null
            }

            const lastDate = new Date(check[0].recordedat)
            const difference = now.getTime() - lastDate.getTime()
            const twoSecondsInMilisseconds = 120000
            if (difference > twoSecondsInMilisseconds && carLocation.isInside !== check[0].isInside) {
                await Repositorie.insertLocation(carLocation)
                const travel = await Repositorie.findTravel(carLocation.plate)

                if (travel.id) {
                    let carsTravel = await RepositorieTravel.listPlates(travel.id)
                    travel.carsTravel = carsTravel

                    if (travel.carsTravel && travel.carsTravel.length == 2) {
                        travel.capacity = travel.carsTravel[1].capacity
                    } else {
                        travel.capacity = travel.carsTravel[0].capacity
                    }
                }
                return this.sendMessage(carLocation, travel)
            }
        } catch (error) {
            console.log(error)
        }

    }

    async countInthePlace(place) {
        try {

            let descPlace = ''
            let message = ''
            switch (place) {
                case '1':
                    place = 'KM 1'
                    descPlace = 'SUNSET KM1'
                    break
                case '2':
                    place = 'KM 28'
                    descPlace = 'SUNSET KM28'
                    break
                case '3':
                    place = 'YPANE'
                    descPlace = 'SUNSET YPANE'
                    break
                case '4':
                    const allCarsMaintenance = await Repositorie.countInMaintenance()
                    if (allCarsMaintenance.length == 0) {
                        message = `*No hay vehiculos en Mantenimiento*`
                    } else {
                        message = `*Vehiculos en Mantenimiento*`
                        allCarsMaintenance.forEach(car => message += `*${car.plate}* - ${car.description}\n`)
                    }

                    return message
            }

            const cars = await Repositorie.countInthePlace(descPlace)
            const carsMaintenance = await Repositorie.countInMaintenance(place)

            message = `*No hay vehículos disponibles en ${descPlace}*\n`
            if (cars.length > 0) {
                message = `*Sigue abajo listado de vehiculos disponibles en ${descPlace}*\n\n`
                cars.forEach(car => {
                    let carInMaintenance = carsMaintenance.find(maintenance => maintenance.plate === car.plate)

                    if (!carInMaintenance) message += `${car.plate}\n`
                })
            }

            if (place == '5523') return message


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