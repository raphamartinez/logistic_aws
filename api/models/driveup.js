const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const fetch = require('node-fetch')
const { Location } = require("whatsapp-web.js");
const Repositorie = require('../repositories/driveup')
const RepositorieCar = require('../repositories/car')
const RepositorieTravel = require('../repositories/travel')
const https = require('https')
const classifyPoint = require("robust-point-in-polygon")
const Queue = require('bull')
const geoQueue = new Queue('geo transcoding', 'redis://127.0.0.1:6379')
const enterGeoQueue = new Queue('Enter in the geozone', 'redis://127.0.0.1:6379')
const ShortUrl = require('./shorturl')

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const listCars = [
    {
        code: 'XBRI106TRASCAN',
        plate: 'XBRI106',
        description: 'XBRI106 TRA SCAN'
    },
    {
        code: 'XBRI107TRASCAN',
        plate: 'XBRI107',
        description: 'XBRI107 TRA SCAN'
    },
    {
        code: 'BAT633CAMHYUN',
        plate: 'BAT633',
        description: 'BAT633 CAM HYUN'
    },
    {
        code: 'CEO412CAMFOTO',
        plate: 'CEO412',
        description: 'CEO412 CAM FOTO'
    },
    {
        code: 'CEV932CAMFUSO',
        plate: 'CEV932',
        description: 'CEV932 CAM FUSO'
    },
    {
        code: 'XBRI005TRASCAN',
        plate: 'XBRI005',
        description: 'XBRI005 TRA SCAN'
    },
    {
        code: 'XBRI007TRASCAN',
        plate: 'XBRI007',
        description: 'XBRI007 TRA SCAN'
    },
    {
        code: 'XBRI002TRASCAN',
        plate: 'XBRI002',
        description: 'XBRI002 TRA SCAN'
    },
    {
        code: 'CEO411CAMFOTO',
        plate: 'CEO411',
        description: 'CEO411 CAM FOTO'
    },
    {
        code: 'CAS702CAMHYUN',
        plate: 'CAS702',
        description: 'CAS702 CAM HYUN'
    },
    {
        code: 'CEU784CAMFUSO',
        plate: 'CEU784',
        description: 'CEU784 CAM FUSO'
    },
    {
        code: 'CEV912CAMFUSO',
        plate: 'CEV912',
        description: 'CEV912 CAM FUSO'
    },
    {
        code: 'BLA554CAMVOLK',
        plate: 'BLA554',
        description: 'BLA554 CAM VOLK'
    },
    {
        code: 'XBRI003TRASCAN',
        plate: 'XBRI003',
        description: 'XBRI003 TRA SCAN'
    },
    {
        code: 'CFP306TRAFAW',
        plate: 'CFP306',
        description: 'CFP306 TRA FAW'
    },
    {
        code: 'AYD885CAMVOLK',
        plate: 'AYD885',
        description: 'AYD885 CAM VOLK'
    },
    {
        code: 'AEA217CAMMERC',
        plate: 'AEA217',
        description: 'AEA217 CAM MERC'
    },
    {
        code: 'CEO407CAMFOTO',
        plate: 'CEO407',
        description: 'CEO407 CAM FOTO'
    },
    {
        code: 'CAB977AUTOKIA',
        plate: 'CAB977',
        description: 'CAB977 CAM KIA'
    },
    {
        code: 'CAS594CAMHYUN',
        plate: 'CAS594',
        description: 'CAS594 CAM HYUN'
    },
    {
        code: 'BFH923DOBLEVOLK',
        plate: 'BFH923',
        description: 'BFH923 DOBLE VOLK'
    },
    {
        code: 'CEV933TRAMERC',
        plate: 'CEV933',
        description: 'CEV933 TRA MERC'
    },
    {
        code: 'CFP304TRAFAW',
        plate: 'CFP304',
        description: 'CFP304 TRA FAW'
    },
    {
        code: 'CFC349TRAVOLK',
        plate: 'CFC349',
        description: 'CFC349 TRA VOLK'
    },
    {
        code: 'CFN459TRAFAW',
        plate: 'CFN459',
        description: 'CFN459 TRA FAW'
    },
    {
        code: 'CFP305TRAFAW',
        plate: 'CFP305',
        description: 'CFP305 TRA FAW'
    },
    {
        code: 'CFN458TRAFAW',
        plate: 'CFN458',
        description: 'CFN458 TRA FAW'
    },
    {
        code: 'XBRI006TRASCAN',
        plate: 'XBRI006',
        description: 'XBRI006 TRA SCAN'
    },
    {
        code: 'XBRI008TRASCAN',
        plate: 'XBRI008',
        description: 'XBRI008 TRA SCAN'
    },
    {
        code: 'XBRI010TRASCAN',
        plate: 'XBRI010',
        description: 'XBRI010 TRA SCAN'
    },
    {
        code: 'XBRI009TRASCAN',
        plate: 'XBRI009',
        description: 'XBRI009 TRA SCAN'
    },
    {
        code: 'XBRI011TRASCAN',
        plate: 'XBRI011',
        description: 'XBRI011 TRA SCAN'
    },
    {
        code: 'CCP584DOBLESCAN',
        plate: 'CCP584',
        description: 'CCP584 DOBLE SCAN'
    },
    {
        code: 'XBRI004TRASCAN',
        plate: 'XBRI004',
        description: 'XBRI004 TRA SCAN'
    },
    {
        code: 'XBRI001TRASCAN',
        plate: 'XBRI001',
        description: 'XBRI001 TRA SCAN'
    },
    {
        code: 'CAS025TRASCAN',
        plate: 'CAS025',
        description: 'CAS025 TRA SCAN'
    },
    {
        code: 'CEV934TRAMERC',
        plate: 'CEV934',
        description: 'CEV934 TRA MERC'
    },
    {
        code: 'CEU782CAMFUSO',
        plate: 'CEU782',
        description: 'CEU782 CAM FUSO'
    },
    {
        code: 'CFP302TRAFAW',
        plate: 'CFP302',
        description: 'CFP302 TRA FAW'
    },
    {
        code: 'CEV913CAMFUSO',
        plate: 'CEV913',
        description: 'CEV913 CAM FUSO'
    },
    {
        code: 'VW91501967',
        plate: 'VW91501967',
        description: 'VW 9150 - 1967'
    },
    {
        code: 'VW91501604',
        plate: 'VW91501604',
        description: 'VW 9150 - 1604'
    },
    {
        code: 'VW91505985',
        plate: 'VW91505985',
        description: 'VW 9150 - 5985'
    },
    {
        code: 'VW91505969',
        plate: 'VW91505969',
        description: 'VW 9150 - 5969'
    },
    {
        code: '05147027',
        plate: 'XBRI011',
        description: 'XBRI011 TRA SCAN'
    }
]

let lastCarLocation = {}

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
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + (-4) * 60 * 60 * 1000)
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

    sendMessage(carLocation, travel, groupId) {
        try {
            let alertType = ''
            let car = carLocation.plateDesc ? carLocation.plateDesc.split(' ') : carLocation.plate
            const now = new Date(carLocation.recordedat)
            switch (carLocation.isInside) {
                case -1:
                    alertType = `*Llegada* al *${carLocation.location}*`
                    enterGeoQueue.add({ carLocation }, {
                        delay: 30000
                    })
                    break
                case 1:
                    alertType = `*Salída* del *${carLocation.location}*`
                    break
            }

            function titleCase(str) {
                var splitStr = str.toLowerCase().split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                return splitStr.join(' ');
            }

            let message = `${alertType}\n`
            car.forEach((c, i) => message += i == 0 ? `*${c}* ` : ` ${c} `)

            if (travel.chest) {
                message += ` - _Acople: ${travel.chest} - Cap: ${travel.capacity}_`
            } else {
                if (travel.plate) message += `- _Cap: ${travel.capacity}_`
            }
            if (travel.driverdesc) message += `\nChofer - ${titleCase(travel.driverdesc)}`
            message += `\n${now.toLocaleTimeString('pt-BR')} ${now.toLocaleDateString('pt-BR')}\n`
            if (travel.obs) message += `${[7, 2].includes(travel.typecode) ? 'Contenedor' : 'Obs'}: ${travel.obs}\n`
            if (travel.origin) message += `\nSalida: _${travel.origindesc}_`
            if (travel.route) message += `\nRetiro: _${travel.routedesc}_`
            if (travel.delivery) message += `\nEntrega: _${travel.deliverydesc}_\n`
            message += `\nLat. Long: ${carLocation.lat},${carLocation.lng}`
            message += `\nURL: ${carLocation.url}`

            if (process.env.NODE_ENV !== 'development') {
                console.log({ groupId, message });
                client.sendMessage(groupId, message)
                sleep(2000)
                return true
            }
        } catch (error) {
            console.log(error);
        }
    }

    async stream() {

        https.get('https://api.driveup.info/stream', {
            headers: {
                'Content-Type': 'application/json',
                'x-driveup-token': process.env.DRIVEUP_TOKEN
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Invalid Response of DriveUp - Code: ${res.statusCode}`);
                res.resume();
                return
            }

            res.on('data', (chunk) => {
                try {
                    const buffer = Buffer.from(chunk)
                    const string = buffer.toString()
                    string.split('\n\n').forEach(obj => {
                        let carLocation = JSON.parse(obj)
                        geoQueue.add({ carLocation })
                    })
                } catch (error) {
                    console.log(error);
                }
            })

            res.on('close', () => {
                console.log('Closed connection')
            });
        })
    }

    async queueResponses(carLocation) {
        try {
            let groupId = ''
            const customers = [
                {
                    name: 'SUNSET KM1',
                    coordinates: [[-54.617956, -25.509451], [-54.618058, -25.508014], [-54.61602, -25.508038], [-54.615494, -25.508352], [-54.615338, -25.508372], [-54.615312, -25.509113], [-54.615473, -25.509243], [-54.615746, -25.509234], [-54.617956, -25.509451]],
                    chat: '120363042760809190@g.us'
                },
                {
                    name: 'SUNSET KM28',
                    coordinates: [[-54.882118, -25.489083], [-54.883994, -25.488989], [-54.883932, -25.487659], [-54.882599, -25.487702], [-54.882546, -25.486518], [-54.882535, -25.485993], [-54.882138, -25.486012], [-54.882131, -25.48611], [-54.881739, -25.486128], [-54.881831, -25.487478], [-54.881921, -25.487604], [-54.881966, -25.488418], [-54.882009, -25.489081], [-54.882118, -25.489083]],
                    chat: '120363042760809190@g.us'
                },
                {
                    name: 'SUNSET YPANE',
                    coordinates: [[-57.487485, -25.485866], [-57.489341, -25.48452], [-57.491133, -25.486351], [-57.491241, -25.48668], [-57.487485, -25.485866]],
                    chat: '120363042760809190@g.us'
                },
                {
                    name: 'PUERTO -  Seguro Fluvial S.A.',
                    coordinates: [[-57.551193, -25.548095], [-57.549112, -25.547978], [-57.549455, -25.548675], [-57.549927, -25.549372], [-57.549949, -25.549372], [-57.558239, -25.549325], [-57.55826, -25.545976], [-57.553725, -25.545965], [-57.551215, -25.546139], [-57.551193, -25.548095]],
                    chat: '120363023896820238@g.us'
                },
                {
                    name: 'PUERTO - Terport S.A. Villeta',
                    coordinates: [[-57.605167, -25.615033], [-57.602456, -25.613957], [-57.601005, -25.612982], [-57.604172, -25.611713], [-57.607549, -25.610679], [-57.610896, -25.613581], [-57.605167, -25.615033]],
                    chat: '120363023896820238@g.us'
                }
            ]

            customers.forEach(customer => {
                const isInside = classifyPoint(customer.coordinates, [carLocation.lng, carLocation.lat])
                if (isInside !== 1) {
                    carLocation.isInside = isInside
                    carLocation.location = customer.name
                    groupId = customer.chat
                }
            })

            if (lastCarLocation && lastCarLocation.plate === carLocation.plate && lastCarLocation.isInside === carLocation.isInside) {
                return null
            } else {
                lastCarLocation = carLocation
            }

            const now = new Date(carLocation.recordedat)
            now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + (-4) * 60 * 60 * 1000)
            carLocation.recordedat = now

            if (carLocation.isInside === 0) return null

            let car = listCars.find(car => car.code === carLocation.plate)
            if (car) {
                carLocation.code = carLocation.plate
                carLocation.plate = car.plate
                carLocation.plateDesc = car.description
            } else {
                carLocation.code = carLocation.plate
            }

            const check = await Repositorie.checkIntheLocation(carLocation.plate)

            if (!carLocation.isInside) {
                carLocation.isInside = 1
                carLocation.location = check.length > 0 ? check[0].location : 'Sin Locale - ERROR'
                const customer = customers.find(customer => customer.location === check[0].location)
                groupId = customer ? customer.chat : '120363042760809190@g.us'
            }

            const page = {
                url: `https://www.google.com.br/maps/place/${carLocation.lat},${carLocation.lng}`,
                title: `Telemetria ${carLocation.plate} - ${carLocation.recordedat}`,
                authenticate: false,
                expiration: false
            }

            if (check.length === 0) {
                const idLocation = await Repositorie.insertLocation(carLocation)
                const url = await ShortUrl.insert(page)
                if (carLocation.isInside !== 1) {
                    const travel = await Repositorie.findTravel(carLocation.plate)

                    if (travel.id) {
                        let carsTravel = await RepositorieTravel.listPlates(travel.id)
                        travel.carsTravel = carsTravel

                        if ([7, 2].includes(travel.typecode)) {
                            await Repositorie.updateLocation(travel.obs, idLocation)
                        }
                        if (travel.carsTravel && travel.carsTravel.length == 2) {
                            travel.capacity = travel.carsTravel[1].capacity
                            travel.chest = travel.carsTravel[1].plate
                        } else {
                            travel.capacity = travel.carsTravel[0].capacity
                        }
                    }

                    carLocation.url = url
                    return this.sendMessage(carLocation, travel, groupId)
                }
                return null
            }

            const lastDate = new Date(check[0].recordedat)
            const difference = now.getTime() - lastDate.getTime()
            const twoMinutesInMilisseconds = 120000
            if (difference > twoMinutesInMilisseconds && carLocation.isInside !== check[0].isInside) {
                await Repositorie.insertLocation(carLocation)
                const travel = await Repositorie.findTravel(carLocation.plate)
                const url = await ShortUrl.insert(page)

                if (travel.id) {
                    let carsTravel = await RepositorieTravel.listPlates(travel.id)
                    travel.carsTravel = carsTravel

                    if (travel.carsTravel && travel.carsTravel.length == 2) {
                        travel.capacity = travel.carsTravel[1].capacity
                    } else {
                        travel.capacity = travel.carsTravel[0].capacity
                    }
                }

                carLocation.url = url
                return this.sendMessage(carLocation, travel, groupId)
            }
            return null
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
                    descPlace = 'KM1'
                    break
                case '2':
                    place = 'KM 28'
                    descPlace = 'KM28'
                    break
                case '3':
                    place = 'YPANE'
                    descPlace = 'YPANE'
                    break
                case '4':
                    const allCarsMaintenance = await Repositorie.countInMaintenance()
                    if (allCarsMaintenance.length == 0) {
                        message = `*No hay vehiculos en Mantenimiento*`
                    } else {
                        message = `*Vehiculos en Mantenimiento*\n`
                        let groupsMaintenance = allCarsMaintenance.reduce(function (r, car) {
                            let findCar = listCars.find(findCar => findCar.plate === car.plate)
                            if (findCar) car.plate = findCar.description
                            let typeCar = car.cartype ? car.cartype : 'CAMIÓN'
                            let line = `*${car.plate}*`
                            if (car.capacity && car.capacity > 0) line += ` - Cap. ${car.capacity}`
                            line += ` - ${car.description}\n\n`
                            r[`${typeCar}`] = r[`${typeCar}`] || []
                            r[`${typeCar}`].push(line)
                            return r
                        }, Object.create({}))

                        const keysMaintenance = Object.keys(groupsMaintenance)

                        keysMaintenance.forEach(key => {
                            if (key === 'remove') return null
                            const noTracking = ['PORTER', 'FURGON', 'SEMI REMOLQUE']
                            const isNoTracking = noTracking.includes(key)
                            message += `--------------------------------------------------\n*${key}* - ${groupsMaintenance[key].length} Un ${isNoTracking ? '(Sin rastreo)' : ''}\n`
                            groupsMaintenance[key].forEach(line => message += line)
                        })
                    }
                    return message
                case '5':
                    const dataCars = await Repositorie.countNotInthePlace()
                    const carsBd = await RepositorieCar.cars()
                    let carsTravel = []
                    if (dataCars.length == 0) {
                        message = `*No hay vehiculos en Viaje*`
                    } else {
                        for (let car of dataCars) {
                            const travel = await Repositorie.findTravel(car.plate)

                            if (travel.id) {
                                let carsTravel = await RepositorieTravel.listPlates(travel.id)
                                travel.carsTravel = carsTravel

                                if (travel.carsTravel && travel.carsTravel.length == 2) {
                                    travel.capacity = travel.carsTravel[1].capacity
                                } else {
                                    travel.capacity = travel.carsTravel[0].capacity
                                }
                            }
                            car.travel = travel
                            carsTravel.push(car)
                        }
                        message = `*Vehiculos en Viaje*\n`
                        let groupsTravel = carsTravel.reduce(function (r, car) {
                            let plate = car.plate
                            let type = 'No definido en sistema.ola'
                            let findCar = listCars.find(findCar => findCar.plate === car.plate)
                            if (findCar) car.plate = findCar.description
                            let line = `*${car.plate}*`
                            if (car.travel.capacity) {
                                line += ` - Cap. ${car.travel.capacity}`
                            } else {
                                if (car.capacity && car.capacity > 0) line += ` - Cap. ${car.capacity}`
                            }
                            if (car.travel.type) {
                                type = car.travel.type
                                line += ` - ${car.travel.origindesc}`
                                if (car.travel.routedesc && car.travel.routedesc != car.travel.origindesc) line += ` /${car.travel.routedesc}`
                                if (car.travel.deliverydesc) line += ` /${car.travel.deliverydesc}`
                                line += '\n'
                            } else {
                                let carsReparto = ['CEO412', 'CAS702', 'CAS594', 'CAB977', 'CEO407', 'CEO411', 'CEO408', 'CEO414', 'BAT633', 'CCP584', 'BFH923', 'CEV913', 'CEV932', 'CEV912', 'CEU784', 'CEU782', 'VW91501604', 'VW91505985', 'VW91505969', 'VW91501967']
                                if (carsReparto.includes(plate)) {
                                    type = 'Vehiculos en Reparto local'
                                    const carbd = carsBd.find(bd => bd.plate === plate)
                                    if (carbd) line += ` - (Vehíc. ${carbd.thirst == 'CDE' ? 'KM1' : carbd.thirst})`
                                }
                                line += '\n'
                            }

                            r[`${type}`] = r[`${type}`] || []
                            r[`${type}`].push(line)
                            return r
                        }, Object.create({}))

                        const keysTravel = Object.keys(groupsTravel)
                        keysTravel.forEach(key => {
                            const noTracking = ['PORTER', 'FURGON', 'SEMI REMOLQUE']
                            const isNoTracking = noTracking.includes(key)
                            message += `--------------------------------------------------\n*${key}* - ${groupsTravel[key].length} Un ${isNoTracking ? '(Sin rastreo)' : ''}\n`
                            groupsTravel[key].forEach(line => message += line)
                        })
                    }
                    return message
            }

            const cars = await Repositorie.countInthePlace(descPlace)
            const carsMaintenance = await Repositorie.countInMaintenance(place)

            message = `*No hay vehículos disponibles en ${descPlace}*\n`
            if (cars.length > 0) {
                message = `*Sigue abajo listado de vehiculos disponibles en ${descPlace}*\n`
                let groups = cars.reduce(function (r, car) {
                    let typeCar = car.cartype ? car.cartype : 'CAMIÓN'
                    let line = ''
                    let carInMaintenance = carsMaintenance.find(maintenance => maintenance.plate === car.plate)
                    let findCar = listCars.find(findCar => findCar.plate === car.plate)
                    if (findCar) car.plate = findCar.description

                    if (!carInMaintenance) {
                        line += `${car.plate}`
                        if (car.capacity && car.capacity > 0) line += ` - Cap. ${car.capacity}`
                        line += '\n'
                        r[`${typeCar}`] = r[`${typeCar}`] || []
                        r[`${typeCar}`].push(line)
                        return r
                    }
                    r[`remove`] = r[`remove`] || []
                    r[`remove`].push(line)
                    return r
                }, Object.create({}))

                const keys = Object.keys(groups)
                keys.forEach(key => {
                    if (key === 'remove') return null
                    const noTracking = ['FURGON', 'SEMI REMOLQUE']
                    const isNoTracking = noTracking.includes(key)
                    message += `--------------------------------------------------\n*${key}* - ${groups[key].length} Un ${isNoTracking ? '(Sin rastreo)' : ''}\n`
                    groups[key].forEach(line => message += line)
                })
            }

            if (place == 'KM 1') return message


            if (carsMaintenance.length == 0) {
                message += `\n*No hay vehiculos en Mantenimiento en ${descPlace}*`
            } else {
                message += `\n*Vehiculos en Mantenimiento en ${descPlace}*\n`
                let groupsMaintenance = carsMaintenance.reduce(function (r, car) {
                    let findCar = listCars.find(findCar => findCar.plate === car.plate)
                    if (findCar) car.plate = findCar.description
                    let typeCar = car.cartype ? car.cartype : 'CAMIÓN'
                    let line = `${car.plate}`
                    if (car.capacity && car.capacity > 0) line += ` - Cap. ${car.capacity}`
                    line += '\n'
                    r[`${typeCar}`] = r[`${typeCar}`] || []
                    r[`${typeCar}`].push(line)
                    return r
                }, Object.create({}))

                const keysMaintenance = Object.keys(groupsMaintenance)

                keysMaintenance.forEach(key => {
                    if (key === 'remove') return null
                    const noTracking = ['PORTER', 'FURGON', 'SEMI REMOLQUE']
                    const isNoTracking = noTracking.includes(key)
                    message += `--------------------------------------------------\n*${key}*  - ${groupsMaintenance[key].length} Un ${isNoTracking ? '(Sin rastreo)' : ''}\n`
                    groupsMaintenance[key].forEach(line => message += line)
                })
            }
            return message
        } catch (error) {
            console.log(error)
        }
    }

    async historicContainer(msg) {
        try {
            let historic = ''
            const travels = await Repositorie.historicContainer(msg)

            for (let travel of travels) {

                let carsTravel = await RepositorieTravel.listPlates(travel.id)
                travel.carsTravel = carsTravel

                if (travel.carsTravel && travel.carsTravel.length == 2) {
                    travel.capacity = travel.carsTravel[1].capacity
                    travel.chest = travel.carsTravel[1].plate
                } else {
                    travel.capacity = travel.carsTravel[0].capacity
                }

                let car = listCars.find(car => car.code === travel.carsTravel[0].plate)
                if (car) {
                    carLocation.code = travel.carsTravel[0].plate
                    carLocation.plate = car.plate
                    carLocation.plateDesc = car.description
                } else {
                    carLocation.code = travel.carsTravel[0].plate
                }
            }

            return historic
        } catch (error) {
            return false
        }
    }
}

module.exports = new DriveUp